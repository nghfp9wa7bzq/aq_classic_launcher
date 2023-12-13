const isDev = false;

if (isDev) { console.log("aq.js start"); }

// block execution for ms
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// use with:
// sleep(2000).then(() => { console.log('Hello World!'); });


class AQTabGroup {
  constructor(container) {
    this.container = container;
    this.multiscreen = false;
    this.server = "aq";
    this.tabs = new Map();

    if (isDev) { console.log("AQTabGroup constructor"); }

    this.getGameVer()
      .then((version) => (this.version = version))
      .then(() => this.addTab())
      .then(() =>
        this.container.removeChild(
          this.container.getElementsByClassName("loading")[0]
        )
      )
      .then(() => {
        let closeButton = document.getElementsByClassName("tabCloseButton")[0];
        closeButton.classList.add("invisible");
      });
  }

  get length() {
    return this.tabs.size;
  }

  setServer(server) {
    this.server = server;
  }

  // get game version from website
  getGameVer() {
    let url = `https://${this.server}.battleon.com/game/web`;
    let gamever = fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        return parser.parseFromString(html, "text/html");
      })
      .then((html) => {
        let object = html.querySelector("param[name='movie']");
        let version = object.getAttribute("value").split("/").pop();

        return version;
      });

      if (isDev) {
        console.log("aq.js getGameVer() ver:");
        console.log(gamever);
      }

    return gamever;
  }

  // add tab
  addTab() {
    // limit tabs to 6
    if (this.length >= 6) {
      return;
    }

    // look for a free tab id
    let id = 0;
    for (let i = 0; i <= this.length; i++) {
      if (!this.tabs.has(i)) {
        id = i;
      }
    }

    let tab = new AQTab(id, this.version, this);
    this.tabs.set(id, tab);
    this.container.appendChild(tab.node);
    this.resize();
  }

  removeTab(id) {
    if (!this.tabs.get(id)) {
      return;
    }

    this.tabs.get(id).removeTab();
    this.tabs.delete(id);

    if (this.length < 1) {
      this.addTab();
      return;
    }

    this.resize();
  }

  // wait until ruffle loads child element
  // we want to resize that too
  resize() {
    if (isDev) { console.log("aq.js resize"); }
    sleep(500).then(() => { this.resize2(); });
  }

  resize2() {
    if (isDev) { console.log("aq.js resize2"); }
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (this.length <= 0) {
      return;
    }

    let columnCount = 1;
    let rowCount = 1;

    let max_width = 0;
    let max_height = 0;

    // maximize cell size through column search
    for (let i = 1; i <= this.length; i++) {
      let temp_height = height / Math.ceil(this.length / i);
      let temp_width = (temp_height * 4.0) / 3.0;
      if (temp_width * i > (width * i) / (i + 1) && temp_width * i <= width) {
        max_width = temp_width;
        max_height = temp_height;
        columnCount = i;
        rowCount = Math.ceil(this.length / columnCount);
      }
    }

    // maximize cell size through row search
    for (let i = 1; i <= this.length; i++) {
      let temp_width = width / Math.ceil(this.length / i);
      let temp_height = (temp_width * 3.0) / 4.0;
      if (
        temp_height * i > (height * i) / (i + 1) &&
        temp_height * i <= height
      ) {
        max_width = temp_width;
        max_height = temp_height;
        rowCount = i;
        columnCount = Math.ceil(this.length / rowCount);
      }
    }

    let tab_width = max_width;
    let tab_height = max_height;

    this.tabs.forEach((element) => {

      if (isDev) { 
        console.log("aq.js AQTabGroup resize() forEach");
        console.log(element);
      }

      try {
        resizeContent(element.node, tab_height, tab_width);

        if (isDev) { 
          console.log("aq.js AQTabGroup resize() forEach after try");
          console.log(element.node);
          console.log("tab_height: " + tab_height);
          console.log("tab_width: " + tab_width);
        }

      } catch (e) {
        console.log("aq.js AQTabGroup resize() forEach error:");
        console.log(e);
        console.log(element);
      }
    });
  }
}

class AQTab {
  constructor(id, version, tabgroup) {
    this.id = id;
    this.tabgroup = tabgroup;
    this.node = this.createAQObject(id, version);
  }

  createAQObject(id, version) {
    // get the server type
    let server = this.tabgroup.server;

    if (isDev) { 
      console.log("aq.js createAQObject");
      console.log("server: " + server);
    }

    // create the object
    let object = document.createElement("object");

    // set its attributes
    let attr = {
      classid: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
      id: "aqgameflash1",
      codebase:
        "https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0",
      class: "fullscreen",
    };

    for (const property in attr) {
      object.setAttribute(property, attr[property]);
    }

    // add its parameters
    let params = {
      movie: `https://${server}.battleon.com/game/flash/${version}`,
      base: `https://${server}.battleon.com/game/flash/`,
      FlashVars: "test=1",
      allowScriptAccess: "sameDomain",
      loop: "false",
      menu: "false",
      quality: "High",
      bgcolor: "#333333",
    };

    for (const param in params) {
      let newParam = document.createElement("param");
      newParam.setAttribute(param, params[param]);
      if (param == "movie") {
        newParam.setAttribute("id", `object_${this.id}`);
      }
      object.appendChild(newParam);
    }

    // create the embed
    let embed = document.createElement("embed");

    let embedattr = {
      class: "fullscreen",
      src: `https://${server}.battleon.com/game/flash/${version}`,
      FlashVars: "test=1",
      loop: "false",
      menu: "false",
      name: "aqgameflash1",
      swLiveConnect: "true",
      bgcolor: "#333333",
      allowScriptAccess: "sameDomain",
      base: `https://${server}.battleon.com/game/flash/`,
      type: "application/x-shockwave-flash",
      pluginspage: "https://www.macromedia.com/go/getflashplayer",
      id: "embed_1",
    };

    for (const property in embedattr) {
      embed.setAttribute(property, embedattr[property]);
    }

    // insert the embed into the object
    object.appendChild(embed);

    // create a tab div
    let tab = document.createElement("div");
    tab.setAttribute("id", id);
    tab.classList.add("tabContainer");

    // insert the object into the tab
    tab.appendChild(object);

    // create close button
    let closeButton = document.createElement("input");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("value", "x");
    closeButton.classList.add("tabCloseButton");
    if (!aqtabs.multiscreen) {
      closeButton.classList.add("invisible");
    }
    closeButton.onclick = () => {
      aqtabs.removeTab(parseInt(tab.getAttribute("id")));
    };
    tab.appendChild(closeButton);

    return tab;
  }

  removeTab() {
    let tab = this.node;
    tab.parentNode.removeChild(tab);
  }
}

function resizeContent(obj, height, width) {
  emb = obj.getElementsByTagName("ruffle-embed")[0];
  if (isDev) {
    console.log("aq.js resizeContent obj");
    console.log(obj);
    console.log("aq.js resizeContent emb");
    console.log(emb);
  }
  obj.style.height = height;
  obj.style.width = width;
  emb.style.height = height;
  emb.style.width = width;
}

function reduceScreenCount(e) {
  aqtabs.removeTab(aqtabs.length - 1);
}

function increaseScreenCount(e) {
  aqtabs.addTab();
}

function localToggleMultiscreen() {
  let multiscreenButton = document.getElementsByClassName(
    "multiscreenPopup"
  )[0];
  // show + button, show X buttons
  if (multiscreenButton.classList.contains("invisible")) {
    multiscreenButton.classList.remove("invisible");

    let closeButton = document.getElementsByClassName("tabCloseButton")[0];
    closeButton.classList.remove("invisible");
    aqtabs.multiscreen = true;
  // hide button
  } else {
    multiscreenButton.classList.add("invisible");
    // remove all tabs, except the first one
    while (aqtabs.length > 1) {
      aqtabs.removeTab(aqtabs.length - 1);
    }

    let closeButton = document.getElementsByClassName("tabCloseButton")[0];
    closeButton.classList.add("invisible");
    aqtabs.multiscreen = false;
  }
}

function localChangeServer(server) {
  aqtabs.setServer(server);

  for (let i = aqtabs.length - 1; i >= 0; i--) {
    aqtabs.removeTab(aqtabs.length - 1);
  }
}

let aqtabs;

window.onload = () => {
  if (isDev) { console.log("aq.js onload"); }

  let container = document.getElementById("container");
  aqtabs = new AQTabGroup(container);

  document.body.onresize = () => {
    console.log("aq.js onresize")
    aqtabs.resize()
  };
};
