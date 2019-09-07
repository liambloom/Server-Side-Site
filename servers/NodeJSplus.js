"use strict";
module.exports = () => {
  String.prototype.titleCase = function () { // arrow functions have a different use of "this" property
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
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