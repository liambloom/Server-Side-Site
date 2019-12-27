const inputBlocker = event => {
  if (modal.isOpen && !event.target.classList.contains("modal")) event.target.blur();
};
window.modal = {
  open: function (e, callback) {
    if (modal.isOpen) throw new Error("There is already a modal showing");
    if (typeof e === "string") e = document.querySelector(e);
    if (!e)  throw `No such element exists element does not exist`; 
    else if (e.tagName === "MODAL") this.waiting = this.waiting.concat([[
      "#" + e.id,
      callback
    ]]);
    else {
      e.classList.remove("hidden");
      document.body.classList.add("blur");
      document.addEventListener("focusin", inputBlocker);
      scroll.lock();
      if (typeof callback === "function") callback();
    }
  },
  close: function (callback) {
    if (!document.querySelector(".modal:not(.hidden) :invalid")) {
      modal.isOpen.classList.add("hidden");
      removeEventListener("focusin", inputBlocker);
      document.body.classList.remove("blur");
      scroll.unlock();
      if (typeof fun === "function") callback();
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
        newEl.id = e.id || "modal" + modal.list.length;
        newEl.classList = "hidden modal-container";
        newEl.innerHTML = res;
        e.parentNode.replaceChild(newEl, e);
        e = document.getElementById(newEl.id);
        e.addEventListener("click", event => {
          if (event.target === e) {
            modal.close();
          }
        });
        document.querySelector(`#${e.id} .modal-content`).classList.add(size);
        document.querySelector(`#${e.id} .modal-body`).innerHTML = content;
        if (type === null) {
          document.querySelector(`#${e.id} .modal-bottom`).style.display = "none";
          continue;
        }
        fetch(`/views/modal/${type}.html`)
          .then(res => {
            if (res.ok) return res.text();
            else throw type + " is not a valid modal type";
          })
          .then(res => res.replace("confirmFunction", confirm))
          .then(res => {
            document.querySelector(`#${e.id} .modal-bottom`).innerHTML = res;
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
      if (modal.waiting.length) modal.waiting.forEach(options => modal.open(...options));
    });
  },
  waiting: [],
  get list() {
    return document.getElementsByClassName("modal-container");
  },
  get isOpen () {
    return document.querySelector(".modal-container:not(.hidden)");
  },
  blurKey: undefined
};
if (document.readyState === "complete") modal.init();
else window.addEventListener("load", modal.init);