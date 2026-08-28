use aml_types::error::AMLResult;
use std::collections::HashMap;
use tauri::{AppHandle, Manager};
use tauri_plugin_http::reqwest;

use crate::discover::helpers::mc_news::{MC_NEWS_ENDPOINT, fetch_mc_news_page};
use crate::discover::models::{NewsPostRequest, NewsPostResponse};
use crate::utils::web::with_retry;

#[tauri::command]
pub async fn fetch_news_post_summaries(
  app: AppHandle,
  requests: Vec<NewsPostRequest>,
) -> AMLResult<NewsPostResponse> {
  let client = with_retry(app.state::<reqwest::Client>().inner().clone());
  let tasks: Vec<_> = requests
    .into_iter()
    .map(|NewsPostRequest { url, cursor }| {
      let client = client.clone();
      async move {
        if url.starts_with(MC_NEWS_ENDPOINT) {
          return fetch_mc_news_page(&client, &url, cursor).await;
        }

        let mut req = client.get(&url).query(&[("pageSize", "12")]);

        if let Some(c) = cursor {
          req = req.query(&[("cursor", &c.to_string())]);
        }

        let resp = req.send().await;
        match resp {
          Ok(resp) if resp.status().is_success() => {
            let parsed: Result<NewsPostResponse, _> = resp.json().await;
            parsed.ok().map(|mut p| {
              for post in &mut p.posts {
                post.source.endpoint_url = url.clone();
              }
              (url.clone(), p)
            })
          }
          _ => None,
        }
      }
    })
    .collect();

  let results = futures::future::join_all(tasks).await;

  let mut all_posts = Vec::new();
  let mut cursors_map = HashMap::new();

  for result in results.into_iter().flatten() {
    let (url, post_response) = result;
    all_posts.extend(post_response.posts);
    if let Some(next_cursor) = post_response.next {
      cursors_map.insert(url, next_cursor);
    }
  }

  all_posts.sort_by(|a, b| b.create_at.cmp(&a.create_at));

  Ok(NewsPostResponse {
    posts: all_posts,
    next: None,
    cursors: Some(cursors_map),
  })
}
