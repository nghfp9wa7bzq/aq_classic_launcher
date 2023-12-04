const { ipcRenderer, session } = require("electron");
const path = require("path");
const generateInfo = require(path.join(__dirname, 'geninfo.js'));

// When the user clicks on div, open the popup
function togglePopup() {
  let popupButton = document.getElementById("menuPopup");
  if (popupButton.getAttribute("visibility") == "true") {
    let popup = document.getElementById("myPopup");
    popup.classList.toggle("show");

    let button = document.getElementById("menuIcon");
    button.classList.toggle("kc_fab_main_btn_focused");

    let hideButton = document.getElementById("hideMenuIcon");
    hideButton.classList.toggle("kc_fab_sec_btn_focused");
    hideButton.onclick = toggleMenuVisibility;
  } else {
    popupButton.classList.toggle("menuPopup_hidden");
    popupButton.setAttribute("visibility", "true");
  }
}

function toggleMenuVisibility() {
  let popupButton = document.getElementById("menuPopup");
  popupButton.classList.toggle("menuPopup_hidden");
  popupButton.setAttribute("visibility", "false");

  let popup = document.getElementById("myPopup");
  popup.classList.remove("show");

  let button = document.getElementById("menuIcon");
  button.classList.toggle("kc_fab_main_btn_focused");

  let hideButton = document.getElementById("hideMenuIcon");
  hideButton.classList.toggle("kc_fab_sec_btn_focused");
  hideButton.onclick = {};
}

function createFloatingObject(id) {
  let container = document.createElement("div");
  container.id = id;

  let closeContainer = document.createElement("div");
  closeContainer.id = id + "Header";
  closeContainer.classList.add("closeIcon");
  closeContainer.style.display = "flexbox";
  closeContainer.style.justifyContent = "flex-end";
  closeContainer.style.width = "inherit";

  let closeButton = document.createElement("a");
  closeButton.setAttribute("href", "#");
  closeButton.innerHTML = "[X]";
  closeButton.addEventListener("click", () => {
    container.parentNode.removeChild(container);
  });

  closeContainer.appendChild(closeButton);
  container.appendChild(closeContainer);

  // add the loading element
  let loadingContainer = document.createElement("div");
  loadingContainer.id = "loading";
  loadingContainer.classList.add("loading");

  let rotating = document.createElement("div");
  rotating.classList.add("lds-dual-ring");

  loadingContainer.appendChild(rotating);
  container.appendChild(loadingContainer);
  container.classList.add("windowPopup");

  document.body.appendChild(container);
  dragElement(container);

  return container;
}

function createFirebaseInfo(url) {
  let floatingContainer = createFloatingObject("firebaseApp");
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      return JSON.parse(text);
    })
    .then((json) => {
      let container = document.createElement("div");
      container.classList.add("popupContent");
      container.style.color = "#fff";
      let info = generateInfo(json);

      container.innerHTML = info;

      // add a link for additional info
      let id = url.split("=")[1];
      let p = document.createElement("p");
      let moreinfo_link = document.createElement("a");
      moreinfo_link.href = "#";
      moreinfo_link.onclick = () => {
        openInfoTab(
          "AQ Char Info",
          `https://aq-char-info.firebaseapp.com/?id=${id}`
        );
      };
      moreinfo_link.innerText = " More Info";
      p.appendChild(moreinfo_link);
      container.appendChild(p);

      floatingContainer.removeChild(
        floatingContainer.getElementsByClassName("loading")[0]
      );
      floatingContainer.appendChild(container);

      return 0;
    });
}

function createWarzoneInfo(url) {
  if (document.getElementById("warzone")) {
    document
      .getElementById("warzone")
      .parentNode.removeChild(document.getElementById("warzone"));
    return;
  }
  let floatingContainer = createFloatingObject("warzone");
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      return parser.parseFromString(text, "text/html");
    })
    .then((html) => {
    console.log(html);
      let table = html.getElementsByTagName("table")[1];
      table.setAttribute("width", "300");
      table.style.width = "300px";
      table.style.wordWrap = "break-word";

      let header = table.getElementsByTagName("h3")[0];
      header.style.color = "#FF6600";

      let legend = table.getElementsByClassName("top10Heading");
      for (let i = 0; i < legend.length; i++) {
        legend[i].style.color = "#FFF";
      }

      let links = table.getElementsByTagName("a");
      while (links.length > 0) {
        links[0].parentNode.innerText = links[0].innerText;
      }

      let container = document.createElement("div");
      container.classList.add("popupContent");

      container.appendChild(table);

      floatingContainer.removeChild(
        floatingContainer.getElementsByClassName("loading")[0]
      );
      floatingContainer.appendChild(container);

      return 0;
    });
}

function createElfInfo(url, name) {
  if (document.getElementById(name)) {
    document
      .getElementById(name)
      .parentNode.removeChild(document.getElementById(name));
    return;
  }
  let floatingContainer = createFloatingObject(name);
  return fetch(url)
    .then((response) => response.text())
    .then((text) => {
      const parser = new DOMParser();
      return parser.parseFromString(text, "text/html");
    })
    .then((html) => {
      let table = html.getElementsByTagName("table")[1];
      table.setAttribute("width", "300");
      table.style.tableLayout = "fixed";

      let legend = table.getElementsByClassName("top10Heading");
      for (let i = 0; i < legend.length; i++) {
        legend[i].style.color = "#FFF";
      }

      let rows = table.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        rows[i].getElementsByTagName("td")[0].style.width = "30px";
        rows[i].removeChild(rows[i].getElementsByTagName("td")[2]);
      }

      let links = table.getElementsByTagName("a");
      while (links.length > 0) {
        links[0].parentNode.innerText = links[0].innerText;
      }

      let container = document.createElement("div");
      container.classList.add("popupContent");

      container.appendChild(table);

      floatingContainer.removeChild(
        floatingContainer.getElementsByClassName("loading")[0]
      );
      floatingContainer.appendChild(container);

      return 0;
    });
}

module.exports = {
  togglePopup,
  toggleMenuVisibility,
  createFloatingObject,
  createFirebaseInfo,
  createWarzoneInfo,
  createElfInfo
}




















