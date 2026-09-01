// 在 Release 模式下防止 Windows 弹出额外控制台窗口，请勿删除！！
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    amethyst_launcher_lib::run()
}
