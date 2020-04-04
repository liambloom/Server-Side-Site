"use strict";
String.prototype.titleCase = function () {//arrow functions have a different use of "this" property
  return this.charAt(0).toUpperCase() + this.slice(1);
};
Object.defineProperty(Array.prototype, "last", {
  value: function () { return this[this.length - 1]; }
});
class ElementError extends String {
  constructor (element) {
    super(element.parentNode.getAttribute("data-err"));
    function clear () {
      element.error = "";
    }
    this.clear = clear;
  }
}
Object.defineProperty(Element.prototype, "error", {
  get: function () { return new ElementError(this); },
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
};
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
document.getRadio = (name) => [...document.getElementsByName(name)].find(e => e.checked);
Object.iterable = obj => typeof obj[Symbol.iterator] === 'function';
const promiseAllApi = Promise.all.bind(Promise);
Promise.all = async (promises) => {
  if (Object.iterable(promises)) {
    return promiseAllApi(promises);
  }
  else {
    const keys = Object.keys(promises);
    const arr = [];
    for (let i of Object.values(promises)) {
      arr.push(i);
    }
    return await (async () => {
      try {
        const returns = {};
        const values = await promiseAllApi(arr);
        for (let i in keys) {
          returns[keys[i]] = values[i];
        }
        return Promise.resolve(returns);
      }
      catch (err) {
        return Promise.reject(err);
      }
    })();
  }
};
Math.avg = (...array) => array.reduce((a, b) => a + b) / array.length;
Math.distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
let lockedAt;
const scrollLocker = () => {
  scroll = lockedAt;
};
class ScrollInterface extends Array {
  constructor() {
    super(scrollX, scrollY);
  }
  get x() {
    return scrollX;
  }
  set x(x) {
    scrollTo(x, scrollY);
  }
  get y() {
    return scrollY;
  }
  set y(y) {
    scrollTo(scrollX, y);
  }
  to(x, y) {
    scrollTo(x, y);
  }
  lock () {
    lockedAt = scroll;
    document.addEventListener("scroll", scrollLocker);
  }
  unlock () {
    document.removeEventListener("scroll", scrollLocker);
  }
}
Object.defineProperty(window, "scroll", {
  get () {
    return new ScrollInterface();
  },
  set (pos) {
    scrollTo(...pos);
  }
});
if (window.setImmediate === undefined) window.setImmediate = (func, ...args) => setTimeout(func, 0, args);
if (window.clearImmediate === undefined) window.clearImmediate = window.clearTimeout;
/*class Color extends String {
  constructor (str, type) { // types are rgb/rgba, hex, hsl/hsv, hsb
    super(str);
    
  }

}
window.Color = Color;*/