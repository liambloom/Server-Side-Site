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
  close: function () {
    for (let e of this.list) {
      document.getElementById(e).classList.add("hidden");
    }
    clearInterval(this.blurKey);
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