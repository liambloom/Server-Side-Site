//jshint esversion:6
window.modal = {
  open: function(e) {
    for (let c of this.list) {
      if (!document.getElementById(c).classList.contains("hidden")) throw "There is already a modal showing";
    }
    e = document.querySelector(e);
    if (!e) throw "That element does not exist";
    e.classList.remove("hidden");
    this.blurKey = setInterval(() => {
      let elem = this.focusOutside;
      if (elem) {elem.blur();}
    }, 100);
  },
  close: function (fun) {
    if (!document.querySelector(".modal:not(.hidden) :invalid")) {
      /*for (let e of this.list) {
        document.getElementById(e).classList.add("hidden");
      }*/
      document.querySelector(".modal:not(.hidden)").classList.add("hidden");
      clearInterval(this.blurKey);
      fun();
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
        newEl.id = e.id;
        newEl.classList = "center hidden modal";
        newEl.innerHTML = res;
        e.parentNode.replaceChild(newEl, e);
        e = document.getElementById(newEl.id);
        document.querySelector(`#${id(e)} .modal-box`).classList.add(size);
        document.querySelector(`#${id(e)} .modal-content`).innerHTML = content;
        fetch(`/views/modal/${type}.html`)
        .then(res => {
          if (res.ok) return res.text();
          else throw type + " is not a valid type";
        })
        .then(res => res.replace("confirmFunction", confirm))
        .then(res => {
          document.querySelector(`#${e.id} .modal-bottom`).innerHTML = res;
        });
      }
    })
    .then(() => {
      document.dispatchEvent(new Event("modalsReady"));
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