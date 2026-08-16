use arcmc_types::error::ArcMCResult;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;
use tauri_plugin_http::reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, CONTENT_TYPE};

use crate::launcher_config::models::LauncherConfig;
use crate::utils::web::with_retry;

#[derive(Debug, Serialize, Deserialize)]
pub struct TestConnectionResponse {
    pub success: bool,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalyzeLogResponse {
    pub success: bool,
    pub analysis: String,
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    stream: bool,
}

#[derive(Debug, Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Debug, Deserialize)]
struct ChatResponse {
    choices: Vec<ChatChoice>,
}

#[derive(Debug, Deserialize)]
struct ChatChoice {
    message: ChatResponseMessage,
}

#[derive(Debug, Deserialize)]
struct ChatResponseMessage {
    content: String,
}

#[tauri::command]
pub async fn test_llm_connection(app: AppHandle) -> ArcMCResult<TestConnectionResponse> {
    let (base_url, api_key) = {
        let config_state = app.state::<Mutex<LauncherConfig>>();
        let config = config_state.lock().map_err(|e| arcmc_types::error::ArcMCError(e.to_string()))?;
        let log_analysis = &config.intelligence.log_analysis;
        (log_analysis.base_url.clone(), log_analysis.api_key.clone())
    };

    if base_url.is_empty() {
        return Ok(TestConnectionResponse {
            success: false,
            message: "Base URL is not configured".to_string(),
        });
    }

    let client = with_retry(app.state::<reqwest::Client>().inner().clone());
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    if !api_key.is_empty() {
        headers.insert(
            AUTHORIZATION,
            HeaderValue::from_str(&format!("Bearer {}", api_key))
                .map_err(|e| arcmc_types::error::ArcMCError(e.to_string()))?,
        );
    }

    let base_url_clean = base_url.trim_end_matches('/');
    let test_url = format!("{}/models", base_url_clean);
    match client.get(&test_url).headers(headers).send().await {
        Ok(response) => {
            let status = response.status();
            if status.is_success() || status == reqwest::StatusCode::UNAUTHORIZED || status == reqwest::StatusCode::FORBIDDEN {
                Ok(TestConnectionResponse {
                    success: true,
                    message: "Connection successful".to_string(),
                })
            } else {
                Ok(TestConnectionResponse {
                    success: false,
                    message: format!("HTTP {}", status),
                })
            }
        }
        Err(e) => Ok(TestConnectionResponse {
            success: false,
            message: format!("Connection failed: {}", e),
        }),
    }
}

#[tauri::command]
pub async fn analyze_game_log(app: AppHandle, log_content: String) -> ArcMCResult<AnalyzeLogResponse> {
    let (base_url, api_key, model) = {
        let config_state = app.state::<Mutex<LauncherConfig>>();
        let config = config_state.lock().map_err(|e| arcmc_types::error::ArcMCError(e.to_string()))?;
        let log_analysis = &config.intelligence.log_analysis;
        (
            log_analysis.base_url.clone(),
            log_analysis.api_key.clone(),
            log_analysis.selected_model.clone(),
        )
    };

    if base_url.is_empty() {
        return Ok(AnalyzeLogResponse {
            success: false,
            analysis: String::new(),
            error: Some("LLM API is not configured".to_string()),
        });
    }

    if model.is_empty() {
        return Ok(AnalyzeLogResponse {
            success: false,
            analysis: String::new(),
            error: Some("Model is not configured".to_string()),
        });
    }

    let client = app.state::<reqwest::Client>().inner().clone();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));

    if !api_key.is_empty() {
        headers.insert(
            AUTHORIZATION,
            HeaderValue::from_str(&format!("Bearer {}", api_key))
                .map_err(|e| arcmc_types::error::ArcMCError(e.to_string()))?,
        );
    }

    let base_url_clean = base_url.trim_end_matches('/');
    let url = format!("{}/chat/completions", base_url_clean);

    // Truncate log if too long (keep last 8000 chars)
    let truncated_log = if log_content.len() > 8000 {
        format!("...{}", &log_content[log_content.len() - 8000..])
    } else {
        log_content
    };

    let prompt = format!(
        "You are a Minecraft game log analysis expert. Analyze the following game log and provide:\n\
         1. A brief summary of what happened\n\
         2. The root cause of the issue (if there's an error)\n\
         3. Suggested solutions\n\n\
         Please respond in the same language as the log content.\n\n\
         Game Log:\n{}",
        truncated_log
    );

    let request_body = ChatRequest {
        model: model.clone(),
        messages: vec![
            ChatMessage {
                role: "system".to_string(),
                content: "You are a helpful Minecraft game log analysis assistant.".to_string(),
            },
            ChatMessage {
                role: "user".to_string(),
                content: prompt,
            },
        ],
        stream: false,
    };

    match client
        .post(&url)
        .headers(headers)
        .json(&request_body)
        .send()
        .await
    {
        Ok(response) => {
            if !response.status().is_success() {
                let status = response.status();
                let text = response.text().await.unwrap_or_default();
                return Ok(AnalyzeLogResponse {
                    success: false,
                    analysis: String::new(),
                    error: Some(format!("API error: HTTP {} - {}", status, text)),
                });
            }

            match response.json::<ChatResponse>().await {
                Ok(chat_response) => {
                    if let Some(choice) = chat_response.choices.first() {
                        Ok(AnalyzeLogResponse {
                            success: true,
                            analysis: choice.message.content.clone(),
                            error: None,
                        })
                    } else {
                        Ok(AnalyzeLogResponse {
                            success: false,
                            analysis: String::new(),
                            error: Some("No response from model".to_string()),
                        })
                    }
                }
                Err(e) => Ok(AnalyzeLogResponse {
                    success: false,
                    analysis: String::new(),
                    error: Some(format!("Failed to parse response: {}", e)),
                }),
            }
        }
        Err(e) => Ok(AnalyzeLogResponse {
            success: false,
            analysis: String::new(),
            error: Some(format!("Request failed: {}", e)),
        }),
    }
}
