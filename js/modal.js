window.modal = {
  open: function(e, callback) {
    for (let c of this.list) {
      if (!document.getElementById(c).classList.contains("hidden")) throw "There is already a modal showing";
    }
    e = document.querySelector(e);
    if (!e) { throw `The element ${e} does not exist`; }
    else if (e.tagName === "MODAL") this.waiting = [
      "#" + e.id,
      callback
    ];
    else {
      e.classList.remove("hidden");
      this.blurKey = setInterval(() => {
        let elem = this.focusOutside;
        if (elem) {elem.blur();}
      }, 100);
      callback();
    }
  },
  close: function (fun) {
    let open = document.querySelector(".modal:not(.hidden)");
    if (!document.querySelector(".modal:not(.hidden) :invalid")) {
      /*for (let e of this.list) {
        document.getElementById(e).classList.add("hidden");
      }*/
      open.classList.add("hidden");
      clearInterval(this.blurKey);
      if (typeof fun === "function") fun();
    }
  },
  init: function () {
    modals = document.getElementsByTagName("modal");
    //console.log(modals[1]);
    fetch("/views/modal/index.html")
    .then(res => res.text())
    .then(res => {
      for (let e of [...modals]) {
        let content = e.innerHTML;
        let type = e.getAttribute("data-escape");
        let confirm = e.getAttribute("data-confirm") || "";
        let size = e.getAttribute("data-size") || "small";
        let newEl = document.createElement("div");
        newEl.id = id(e);
        newEl.classList = "center hidden modal";
        newEl.innerHTML = res;
        e.parentNode.replaceChild(newEl, e);
        e = document.getElementById(newEl.id);
        document.querySelector(`#${e.id} .modal-box`).classList.add(size);
        document.querySelector(`#${e.id} .modal-content`).innerHTML = content;
        fetch(`/views/modal/${type}.html`)
          .then(res => {
            if (res.ok) return res.text();
            else if (type === null) {
              document.querySelector(`#${e.id} .modal-bottom`).style.display = "none";
              return "";
            }
            else throw type + " is not a valid type";
          })
          .then(res => res.replace("confirmFunction", confirm))
          .then(res => {
            if (res) document.querySelector(`#${e.id} .modal-bottom`).innerHTML = res;
          })
          .catch(error => {
            throw error;
          });
      }
    })
    .then(() => {
      document.dispatchEvent(new Event("modalsReady"));
    })
    .then(() => {
      if (modal.waiting) modal.open(...modal.waiting);
    });
  },
  get list() {
    return id(document.getElementsByClassName("modal"));
  },
  get focusOutside() {
    return document.querySelector(id([...document.querySelectorAll("*")].filter(v => {
      while (v.parentNode !== document.querySelector("html").parentNode) {
        if (v.parentNode.classList.contains("modal")) return false;
        else v = v.parentNode;
      }
      return true;
    })).toString().replace(/^/, "#").replace(/,/g, ",#").replace(/#[^a-z][^,]*/gi, "").replace(/^,|,$/g, "").replace(/,+/g, ":focus,").replace(/$/, ":focus"));
  },
  blurKey: undefined
};
if (document.readyState === "complete") modal.init();
else window.addEventListener("load", modal.init);