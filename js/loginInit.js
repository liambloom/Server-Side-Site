//jshint esversion:6
var boxColor = () => {
  if (theme.mode === "light") document.getElementById("box").style["background-color"] = "#ffffff80";
  else document.getElementById("box").style["background-color"] = "#00000080";
};

var eyeColor = () => {
  document.getElementById("eye").style.setProperty("fill", themes[theme.color].headTextColor);
};

var themeFunc = () => {
  boxColor();
  eyeColor();
};
var errMsg = (e, msg) => {
  if (msg) {
    e.parentNode.setAttribute("data-err", msg);
    e.setCustomValidity(msg);
  }
  else {
    e.parentNode.removeAttribute("data-err");
    e.setCustomValidity("");
  }
};
var checkConsecutive = (strings) => {
  if (!strings) return false;
  let c = 0;
  let prev;
  let dir;
  if (/\d/.test(strings[0])) type = "number";
  else {
    type = "string";
    var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  }
  for (let i of strings) {
    for (let m of i.split("")) {
      if (type === "number") m = parseInt(m) + 1;
      else m = alphabet.indexOf(m) + 1;
      if (prev) {
        if (prev + 1 === m && dir !== "down") {
          c++;
          dir = "up";
        }
        else if (prev - 1 === m && dir !== "up") {
          c++;
          dir = "down";
        }
        else {
          c = 0;
          dir = "";
        }
      }
      //console.log(c);
      if (c >= 2) return true;
      prev = m;
    }
  }
  return false;
};
if (window.themeReady) themeFunc();
else window.addEventListener("themeReady", themeFunc);