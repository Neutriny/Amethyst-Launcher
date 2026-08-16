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

    // OpenAI-compatible API test: GET {base_url}/models
    let base_url_clean = base_url.trim_end_matches('/');
    let test_url = format!("{}/models", base_url_clean);
    match client.get(&test_url).headers(headers).send().await {
        Ok(response) => {
            let status = response.status();
            if status.is_success() || status == reqwest::StatusCode::UNAUTHORIZED || status == reqwest::StatusCode::FORBIDDEN {
                // 2xx, 401, 403 all indicate the server is reachable
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
