"use strict";
module.exports = () => {
  Object.defineProperties(Object.prototype, {
    randomProperty: {
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
      value: function () { 
        for (let i = this.length - 1; i > 0; i--) {
          const rand = Math.floor((i + 1) * Math.random());
          const temp = this[rand];
          this[rand] = this[i];
          this[i] = temp;
        }
        return this;
      }
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
};