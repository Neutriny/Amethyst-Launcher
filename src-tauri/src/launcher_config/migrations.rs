use serde::Deserialize;
use serde::de::Deserializer;

use crate::launcher_config::models::AppearanceBackgroundConfig;

// Migrate old built-in wallpaper choices to the new default preset.
const LEGACY_BUILT_IN_BACKGROUNDS: &[&str] = &["%built-in:Jokull", "%built-in:GNLXC"];

#[derive(Deserialize, Default)]
#[serde(rename_all = "camelCase", default)]
struct BackgroundPayload {
  choice: String,
  random_custom: bool,
  auto_darken: bool,
}

pub fn deserialize_background<'de, D>(
  deserializer: D,
) -> Result<AppearanceBackgroundConfig, D::Error>
where
  D: Deserializer<'de>,
{
  let mut payload = BackgroundPayload::deserialize(deserializer)?;

  if LEGACY_BUILT_IN_BACKGROUNDS.contains(&payload.choice.as_str()) {
    payload.choice = "%built-in:Florwyn".to_string();
    payload.auto_darken = false;
  }

  Ok(AppearanceBackgroundConfig {
    choice: payload.choice,
    random_custom: payload.random_custom,
    auto_darken: payload.auto_darken,
  })
}
