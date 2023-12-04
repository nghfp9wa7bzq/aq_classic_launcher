const {
  Menu,
  MenuItem,
} = require("electron");

function createMenu(win) {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "Options",
      submenu: [
        {
          label: "Reload",
          type: "normal",
          accelerator: "F5",
          click: (item, window, event) => {
            win.webContents.send("hotkey", "reload");
          },
        },
        {
          label: "Clear Cache",
          type: "normal",
          accelerator: "F4",
          click: (item, window, event) => {
            win.webContents.session.clearCache(function () {
              win.webContents.session.getCacheSize((value) => {
                if (isDev) {
                  console.log(value);
                }
              });
            });
          },
        },
        {
          label: "Reload + Clear Cache",
          type: "normal",
          accelerator: process.platform === "darwin" ? "Cmd+F5" : "Ctrl+F5",
          click: (item, window, event) => {
            win.webContents.session.clearCache(function () {
              win.webContents.session.getCacheSize((value) => {
                if (isDev) {
                  console.log(value);
                }
              });
            });
            win.webContents.send("hotkey", "reload");
          },
        },
        {
          label: "Toggle Fullscreen",
          type: "normal",
          accelerator: "F11",
          click: (item, window, event) => {
            if (win.isFullScreen()) {
              win.setFullScreen(false);
            } else {
              win.setFullScreen(true);
            }
          },
        },
        {
          label: "Open Developer Tools",
          type: "normal",
          accelerator:
            process.platform === "darwin" ? "Cmd+Shift+I" : "Ctrl+Shift+I",
          click: (item, window, event) => {
            //win.webContents.openDevTools();
            win.webContents.send("hotkey", "devtools");
          },
        },
      ],
    })
  );

  Menu.setApplicationMenu(menu);
}

module.exports = createMenu
