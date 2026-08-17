use serde::{Deserialize, Serialize};
use aml_types::error::AMLResult;
use std::fs;
use std::sync::Mutex;
use std::time::Instant;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;

use crate::resource::helpers::misc::get_download_api;
use crate::resource::models::{GameClientResourceInfo, ResourceError, ResourceType, SourceType};

pub struct VersionManifestCache {
  data: Vec<GameClientResourceInfo>,
  fetched_at: Instant,
}

const CACHE_TTL_SECS: u64 = 600; // 10 minutes

impl VersionManifestCache {
  pub fn new() -> Self {
    Self {
      data: Vec::new(),
      fetched_at: Instant::now() - std::time::Duration::from_secs(CACHE_TTL_SECS + 1),
    }
  }
}

#[derive(Serialize, Deserialize, Default)]
struct VersionManifest {
  pub latest: LatestVersion,
  pub versions: Vec<GameResource>,
}

#[derive(Debug, PartialEq, Eq, Clone, Deserialize, Serialize, Default)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct GameResource {
  pub id: String,
  #[serde(rename = "type")]
  pub game_type: String,
  pub release_time: String,
  pub time: String,
  pub url: String,
}

#[derive(Serialize, Deserialize, Default)]
struct LatestVersion {
  pub release: String,
  pub snapshot: String,
}

pub async fn get_game_version_manifest(
  app: &AppHandle,
  priority_list: &[SourceType],
) -> AMLResult<Vec<GameClientResourceInfo>> {
  // Check in-memory cache first
  if let Ok(cache) = app.state::<Mutex<VersionManifestCache>>().lock() {
    if cache.fetched_at.elapsed().as_secs() < CACHE_TTL_SECS && !cache.data.is_empty() {
      return Ok(cache.data.clone());
    }
  }

  let client = app.state::<reqwest::Client>();

  for source_type in priority_list.iter() {
    let url = get_download_api(*source_type, ResourceType::VersionManifest)?;
    let response = match client.get(url).send().await {
      Ok(resp) if resp.status().is_success() => resp,
      _ => continue,
    };

    let manifest = match response.json::<VersionManifest>().await {
      Ok(m) => m,
      Err(_) => return Err(ResourceError::ParseError.into()),
    };

    save_version_list_to_cache(app, &manifest.versions);

    let game_info_list: Vec<GameClientResourceInfo> = manifest
      .versions
      .into_iter()
      .map(|info| {
        let april_fool =
          info.release_time.contains("04-01") && semver::Version::parse(&info.id).is_err();
        GameClientResourceInfo {
          id: info.id,
          game_type: if april_fool {
            "april_fools".to_string()
          } else {
            info.game_type
          },
          release_time: info.release_time,
          url: info.url,
        }
      })
      .collect();

    // Update in-memory cache
    if let Ok(mut cache) = app.state::<Mutex<VersionManifestCache>>().lock() {
      cache.data = game_info_list.clone();
      cache.fetched_at = Instant::now();
    }

    return Ok(game_info_list);
  }

  // Fallback: return cached data even if expired, when network fails
  if let Ok(cache) = app.state::<Mutex<VersionManifestCache>>().lock() {
    if !cache.data.is_empty() {
      return Ok(cache.data.clone());
    }
  }

  Err(ResourceError::NetworkError.into())
}

fn save_version_list_to_cache(app: &AppHandle, versions: &[GameResource]) {
  let cache_dir = match app.path().app_cache_dir().ok() {
    Some(dir) => dir,
    None => return,
  };

  if !cache_dir.exists() && fs::create_dir_all(&cache_dir).is_err() {
    return;
  }

  let file_path = cache_dir.join("game_versions.txt");
  let mut ids: Vec<String> = versions.iter().map(|v| v.id.clone()).collect();
  ids.reverse(); // reverse order

  let content = ids.join("\n");
  let _ = fs::write(file_path, content);
}
