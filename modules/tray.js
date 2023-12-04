const {
  app,
  Menu,
  Tray,
} = require("electron");

function createSystemTray(win, icon) {
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Reload",
      type: "normal",
      click: (item, window, event) => {
        win.webContents.send("hotkey", "reload");
      },
    },
    {
      label: "Clear Cache",
      type: "normal",
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
      label: "Exit",
      type: "normal",
      click: (item, window, event) => {
        if ((process.platform == "win32")
          || (process.platform == "linux")) {
          tray.destroy();
        }
        app.quit();
      },
    },
  ]);
  tray.setToolTip("AQClassic Launcher");
  tray.setContextMenu(contextMenu);
  
  return tray
}

module.exports = createSystemTray
