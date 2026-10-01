use tauri::{Emitter, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, _cwd| {
            let urls: Vec<String> = args
                .iter()
                .filter(|arg| arg.starts_with("helpy://"))
                .cloned()
                .collect();

            if !urls.is_empty() {
                // Emit on the same event channel that `@tauri-apps/plugin-deep-link`
                // uses internally, so the JS `onOpenUrl` handler fires.
                let _ = app.emit("deep-link://new-url", &urls);
            }

            // Bring the existing main window to the foreground.
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.unminimize();
                let _ = window.set_focus();
                let _ = window.show();
            }
        }))
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
