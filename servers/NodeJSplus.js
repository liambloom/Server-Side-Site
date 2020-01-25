"use strict";
module.exports = () => {
  Object.defineProperties(Object.prototype, {
    random: {
      get: function () {
        if (this && typeof this === "object") return function () { // Works for objects or arrays
          const keys = Object.keys(this);
          const key = keys[Math.floor(Math.random() * keys.length)];
          if (!Array.isArray(this) && this.name === undefined) this[key].name = key;
          return this[key];
        };
      }
    }
  });
  Object.defineProperties(Array.prototype, {
    last: {
      value: function () { return this[this.length - 1]; }
    },
    shuffle: {
      value: function () { return this.sort(() => Math.random() - 0.5); }
    }
  });
  Object.defineProperties(String.prototype, {
    titleCase: {
      value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
      }
    },
    cssSafe: {
      value: function () {
        return this.replace(/\s/g, "_").replace(/(?:^-(?![_a-zA-Z]))|(?:^[^_a-zA-Z])|[^_a-zA-Z0-9-]/, "");
      }
    }
  });
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
  Object.defineProperty(Boolean, "random", { // For some reason, node insists that Boolean.random is a getter only property and cannot be set, so I need to use Object.defineProperty
    value: function () {
      return !Math.round(Math.random());
    }
  });
  RegExp.prototype.concat = function (regex) {
    return new RegExp(this.source + regex.source, (this.flags + regex.flags).replace(/(.)(?=.*\1)/g, ""));
  };
};