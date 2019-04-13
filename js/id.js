//jshint esversion:6
var id = e => {
  let res;
  if (typeof e === "string") {
    res = id([...document.querySelectorAll(e)]);
  }
  else if (typeof e === "object") {
    try {
      res = [];
      for (let e2 of [...e]) {
        res.push(id(e2));
      }
    }
    catch (err) {
      res = undefined;
      if (!e.id) {
        let max = document.querySelectorAll("*").length;
        do {
          e.id = "e" + Math.floor(Math.random() * max).toString();
        }
        while (document.querySelectorAll("#" + e.id).length > 1);
      }
    }
  }
  else {
    throw e + "must be a string or object";
  }
  if (!res) res = e.id;
  return res;
};