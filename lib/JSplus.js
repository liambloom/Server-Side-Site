"use strict";
String.prototype.titleCase = function () {//arrow functions have a different use of "this" property
  return this.charAt(0).toUpperCase() + this.slice(1);
};
Array.prototype.last = function () {
  return this[this.length - 1];
};
Object.defineProperty(Element.prototype, "error", {
  get: function () { return this.parentNode.getAttribute("data-err"); },
  set: function (msg) {
    if (msg) {
      this.parentNode.setAttribute("data-err", msg);
      this.setCustomValidity(msg);
    }
    else {
      this.parentNode.removeAttribute("data-err");
      this.setCustomValidity("");
    }
  }
});
let eventListenerApi = Element.prototype.addEventListener;
Element.prototype.addEventListener = function (type, listener, options) {
  if (type === "enter") {
    eventListenerApi.call(this, "keyup", event => {
      if (event.keyCode === 13) listener(event);
    }, options);
  }
  else {
    eventListenerApi.call(this, type, listener, options);
  }
};
Element.prototype.delete = function () {
  this.parentElement.removeChild(this);
}
Object.defineProperty(Element.prototype, "onenter", {
  get: function () { return null; },
  set: function (callback) {
    if (typeof callback === "function") {
      Object.defineProperty(this, "onenter", {
        get: function () { return callback; }
      });
      this.addEventListener("enter", event => {
        if (typeof this.onenter === "function") this.onenter(event);
      });
    }
  },
  writeable: true
});

Math.avg = (...array) => array.reduce((a, b) => a + b) / array.length;
Math.distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);