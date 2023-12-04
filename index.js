const { ipcRenderer, session } = require("electron");
//const isDev = require("electron-is-dev");
const isDev = false;
const TabGroup = require("electron-tabs");
//const dragula = require("dragula");
const path = require("path");
const {
  togglePopup,
  toggleMenuVisibility,
  createFloatingObject,
  createFirebaseInfo,
  createWarzoneInfo,
  createElfInfo
  } = require(path.join(__dirname, '/modules/popupmenu.js'));

//console.log(createSystemTray());
/*
function dragElement(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById(element.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(element.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
*/


function getTitle(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const title = doc.querySelectorAll("title")[0];
      return title.innerText;
    });
}

function navigate(tab) {
  webview = tab.webview;
  function navigation(e) {
    let title = getTitle(e.url).then(function (title) {
      tabGroup.addTab({
        title: title,
        src: e.url,
        active: true,
        plugins: true,
        ready: navigate,
      });
    });
  }

  webview.addEventListener("new-window", navigation);
  webview.addEventListener("will-navigate", navigation);
}

function copyURL(url, type) {
  let textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  if (type == "url") {
    textArea.value = url;
  } else {
    textArea.value = url.split("=")[1];
  }
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    if (isDev) {
      console.log("Copying text command was " + msg);
      console.log("Url: " + textArea.value);
    }
  } catch (err) {
    console.log("Oops, unable to copy");
  }

  document.body.removeChild(textArea);
}

function openInfoTab(name, url, option = null, render = null) {
  if (!url.includes("aq-char-info")) {
    togglePopup();
  }

  if (render == null) {
    if (option != null) {
      url += option;
    }
    let title = getTitle(url).then(function (title) {
      tabGroup.addTab({
        title: name ? name : title,
        src: url,
        active: true,
        plugins: true,
        closable: true,
        ready: navigate,
      });
    });
  } else {
    if (option == null) {
      render(url);
    } else {
      render(url, option);
    }
  }
}

function getActiveTabView() {
  return tabGroup.getActiveTab().webview;
}

function toggleMultiscreen() {
  let button = document.getElementById("multiscreenToggle");

  if (isDev) {
    console.log("multiscreenToggle to: " + button.getAttribute("state"));
  }

  if (button.getAttribute("state") == "Off") {
    button.setAttribute("state", "On");
  } else {
    button.setAttribute("state", "Off");
  }

  getActiveTabView().executeJavaScript("localToggleMultiscreen()");
  return;
}

function changeServer() {
  let selector = document.getElementById("serverSelect");
  let server = selector.value;

  let webview = getActiveTabView();
  webview.setAttribute("server", server);
  webview.executeJavaScript(`localChangeServer('${server}')`);
  return;
}

const tabGroup = document.querySelector("tab-group");

function createTab() {
  return {
    title: "AdventureQuest",
    src: "aq.html",
    active: true,
    webviewAttributes: {
      nodeintegration: "nodeintegration"
    },
    closable: true,
    ready: navigate,
  };
}

//console.log(tabGroup)
tabGroup.setDefaultTab(createTab());

function setClipboardArea(tab) {
  let clipboard_area = document.getElementById("copyClipboard");
  if (tab.webviewAttributes.src.includes("charview")) {
    clipboard_area.innerHTML = "";
    clipboard_area.setAttribute(
      "style",
      "position: relative; display: block; float: right; z-index: 999 !important; margin: 10px 25px;"
    );
    let copyURLButton = document.createElement("input");
    copyURLButton.type = "button";
    copyURLButton.value = "Copy URL";
    copyURLButton.id = "copyUrl";
    copyURLButton.onclick = () => {
      copyURL(tab.webviewAttributes.src, "url");
    };

    let copyIDButton = document.createElement("input");
    copyIDButton.type = "button";
    copyIDButton.value = "Copy ID";
    copyIDButton.id = "copyId";
    copyIDButton.onclick = () => {
      copyURL(tab.webviewAttributes.src, "id");
    };

    clipboard_area.appendChild(copyIDButton);
    clipboard_area.appendChild(copyURLButton);
  } else {
    clipboard_area.setAttribute(
      "style",
      "position: relative; display: none; margin: 20px;"
    );
    clipboard_area.innerHTML = "";
  }
}

function setSelectedServer(tab) {
  let selector_area = document.getElementById("serverSelector");
  if (tab.webviewAttributes.src.includes("aq.html")) {
    selector_area.innerHTML = "";
    selector_area.setAttribute(
      "style",
      "position: absolute; right: 0; height: inherit; display: flex; justify-content: center;"
    );
    let selector = document.createElement("select");
    selector.setAttribute("name", "serverSelect");
    selector.setAttribute("id", "serverSelect");

    let server = tab.webview.getAttribute("server");
    if (server == null) {
      tab.webview.setAttribute("server", "aq");
      server = "aq";
    }

    let options = ["aq", "guardian", "new"];
    options.forEach((option) => {
      let optionElement = document.createElement("option");
      optionElement.setAttribute("value", option);
      if (option == server) {
        optionElement.setAttribute("selected", "selected");
      }
      optionElement.innerText = option;
      selector.appendChild(optionElement);
    });

    selector.onchange = changeServer;

    selector_area.appendChild(selector);
  } else {
    selector_area.setAttribute(
      "style",
      "position: absolute; right: 0; display: none;"
    );
    selector_area.innerHTML = "";
  }
}

tabGroup.on("tab-active", (tab, tabGroup) => {
  setClipboardArea(tab);
  setSelectedServer(tab);
});

// auto-add a new tab if all tabs are removed
tabGroup.on("tab-removed", (tab, tabGroup) => {
  if (isDev) {
    console.log(tabGroup.getTabs());
  }
  if (tabGroup.getTabs().length == 0) {
    tabGroup.addTab(createTab());
  }
});

// create initial tab
tabGroup.addTab(createTab());

ipcRenderer.on("hotkey", (event, message) => {
//  let webview = document.querySelector("webview.visible");
  let webview = getActiveTabView();

  switch (message) {
    case "reload":
      webview.reload();
      break;
    case "devtools":
      webview.openDevTools();
      break;
  }
});

ipcRenderer.on("asynchronous-reply", (event, arg) => {
  console.log(arg);
});

ipcRenderer.send("asynchronous-message");
