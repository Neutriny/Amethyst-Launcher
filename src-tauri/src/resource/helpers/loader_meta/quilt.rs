use semver::Version;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use aml_types::error::AMLResult;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;

use crate::instance::models::misc::ModLoaderType;
use crate::resource::helpers::misc::get_download_api;
use crate::resource::models::{ModLoaderResourceInfo, ResourceError, ResourceType, SourceType};

#[derive(Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
struct QuiltMetaItem {
  pub loader: QuiltLoaderInfo,
  pub intermediary: Value,
}

#[derive(Serialize, Deserialize, Default)]
struct QuiltLoaderInfo {
  pub version: String,
}

/// Fetch Quilt loader versions for a specific Minecraft version
pub async fn get_quilt_meta_by_game_version(
  app: &AppHandle,
  priority_list: &[SourceType],
  game_version: &str,
) -> AMLResult<Vec<ModLoaderResourceInfo>> {
  let client = app.state::<reqwest::Client>();

  // Quilt meta: always try official source first, then fallback to others
  let mut sources = vec![SourceType::Official];
  for source in priority_list {
    if *source != SourceType::Official {
      sources.push(*source);
    }
  }

  let mut last_error = None;

  for source_type in sources.iter() {
    let url = get_download_api(*source_type, ResourceType::QuiltMeta)?
      .join("v3/versions/loader/")?
      .join(game_version)?;

    log::info!("Fetching Quilt meta from: {}", url);

    match client.get(url).header("Accept-Encoding", "identity").send().await {
      Ok(response) => {
        let status = response.status();
        log::info!("Quilt meta response status: {}", status);

        if status.is_success() {
          match response.text().await {
            Ok(text) => {
              log::debug!("Quilt meta response body (first 1000 chars): {}", &text[..text.len().min(1000)]);
              match serde_json::from_str::<Vec<QuiltMetaItem>>(&text) {
                Ok(mut manifest) => {
                  manifest.sort_by(|a, b| {
                    match (
                      Version::parse(&a.loader.version),
                      Version::parse(&b.loader.version),
                    ) {
                      (Ok(left), Ok(right)) => right.cmp(&left),
                      (Ok(_), Err(_)) => std::cmp::Ordering::Less,
                      (Err(_), Ok(_)) => std::cmp::Ordering::Greater,
                      (Err(_), Err(_)) => b.loader.version.cmp(&a.loader.version),
                    }
                  });
                  return Ok(
                    manifest
                      .into_iter()
                      .map(|info| {
                        let version = info.loader.version;
                        let stable = !version.contains("beta")
                          && !version.contains("alpha")
                          && !version.contains("rc");
                        ModLoaderResourceInfo {
                          loader_type: ModLoaderType::Quilt,
                          version,
                          description: String::new(),
                          stable: Some(stable),
                          branch: None,
                        }
                      })
                      .collect(),
                  );
                }
                Err(e) => {
                  log::error!("Failed to parse Quilt meta JSON: {}", e);
                  last_error = Some(ResourceError::ParseError);
                  continue;
                }
              }
            }
            Err(e) => {
              log::error!("Failed to read Quilt meta response body: {}", e);
              last_error = Some(ResourceError::NetworkError);
              continue;
            }
          }
        } else {
          log::warn!("Quilt meta request failed with status: {}", status);
          last_error = Some(ResourceError::NetworkError);
          continue;
        }
      }
      Err(e) => {
        log::error!("Failed to fetch Quilt meta: {}", e);
        last_error = Some(ResourceError::NetworkError);
        continue;
      }
    }
  }

  Err(last_error.unwrap_or(ResourceError::NetworkError).into())
}
