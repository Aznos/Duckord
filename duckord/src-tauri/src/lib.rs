use tauri::Manager;
use serde::{Deserialize, Serialize};
use std::collection::HashMap;

#[derive(Deserialize)]
pub struct PostRequestArgs {
    url: String,
    headers: Option<HashMap<String, String>>,
    body: Option<String>,
}

#[derive(Serialize)]
pub struct PostResponse {
    status: u16,
    body: String,
}

#[tauri::command]
async fn post_request(args: PostRequestArgs) -> Result<PostResponse, String> {
    let client = reqwest::Client::new();
    let mut req = client.post(&args.url);

    if let Some(headers) = &args.headers {
        for(k, v) in headers {
            req = req.header(k, v);
        }
    }

    if let Some(body) = &args.body {
        req = req.body(body.clone());
    }

    let resp = req.send().await.map_err(|e| e.to_string())?;
    let status = resp.status().as_u16();
    let body = resp.text().await.map_err(|e| e.to_string())?;

    Ok(PostResponse { status, body })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![post_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
