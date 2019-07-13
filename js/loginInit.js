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
let show = () => {
  let e = document.getElementById("password");
  e.setAttribute("type", "text");
  if (e.getBoundingClientRect().width > window.innerWidth * 0.45) e.classList.add("focus");
};
let hide = () => {
  let e = document.getElementById("password");
  e.setAttribute("type", "password");
  if (e.getBoundingClientRect().width > window.innerWidth * 0.45) e.focus();
  e.classList.remove("focus");
};
let tbInit = (name, required) => {
  let el = document.getElementById(name);
  let output = {};
  if (el) {
    let val = el.value;
    if (typeof required === "undefined") required = true;
    if (required) {
      el.setAttribute("required", "required");
      if (!val || !/\S/.test(val)) errMsg(el, name.replace(/(?=[A-Z])./, m => " " + m.toLowerCase()).replace(/(^.)/, m => m.toUpperCase()) + " is required");
      else errMsg(el);
    }
    else if (!val || !/\S/.test(val)) {
      //let modal = document.getElementById(name + "Warning");
      window.modal.open(`#${name}Warning`);
      output.wait = true;
    }
    output[name] = val;
    output[name + "Element"] = el;
  }
  //else return {};
  return output;
};
var confirmInit = () => {
  return {...tbInit("username"), ...tbInit("email", false), ...tbInit("password"), ...tbInit("confirmPassword")}; // Supported in Major browsers exept Edge
};

let load = () => {
  document.getElementById("showPass").addEventListener("mousedown", show);
  document.getElementById("showPass").addEventListener("mouseup", hide);
  document.getElementById("showPass").addEventListener("mouseleave", hide);
  document.getElementById("lightdark").addEventListener("click", boxColor);
  if (document.getElementById("username")) document.getElementById("username").addEventListener("input", () => {tbInit("username");});
  document.getElementById("password").addEventListener("input", () => {tbInit("password");});
  window.addEventListener("colorChange", eyeColor);
};

if (document.readyState === "complete") load();
else window.addEventListener("load", load);
if (window.themeReady) themeFunc();
else window.addEventListener("themeReady", themeFunc);