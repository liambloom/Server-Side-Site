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
let usernameInit = () => {
  let usernameElement = document.getElementById("username");
  let username = usernameElement.value;
  usernameElement.setAttribute("required", "required");
  if (!username) errMsg(usernameElement, "Username is reqired");
  else errMsg(usernameElement);
  return {usernameElement, username};
};
let passwordInit = () => {
  let passwordElement = document.getElementById("password");
  let password = passwordElement.value;
  passwordElement.setAttribute("required", "required");
  if (!password) errMsg(passwordElement, "Password is required");
  else errMsg(passwordElement);
  return {passwordElement, password};
};
var confirmInit = () => {
  return {...usernameInit(), ...passwordInit()}; // Supported in Major browsers exept Edge
};

let load = () => {
  document.getElementById("showPass").addEventListener("mousedown", show);
  document.getElementById("showPass").addEventListener("mouseup", hide);
  document.getElementById("showPass").addEventListener("mouseleave", hide);
  document.getElementById("Layer_1").addEventListener("click", boxColor);
  document.getElementById("username").addEventListener("input", usernameInit);
  document.getElementById("password").addEventListener("input", passwordInit);
  window.addEventListener("colorChange", eyeColor);
};

if (document.readyState === "complete") load();
else window.addEventListener("load", load)
if (window.themeReady) themeFunc();
else window.addEventListener("themeReady", themeFunc);