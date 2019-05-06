//jshint esversion:6
let boxColor = () => {
  if (theme.mode === "light") document.getElementById("box").style["background-color"] = "#ffffff80";
  else document.getElementById("box").style["background-color"] = "#00000080";
};
let eyeColor = () => {
  document.getElementById("eye").style.setProperty("fill", themes[theme.color].headTextColor);
};
let themeFunc = () => {
  boxColor();
  eyeColor();
};
let errMsg = (e, msg) => {
  if (msg) {
    e.parentNode.setAttribute("data-err", msg);
    e.setCustomValidity(msg);
  }
  else {
    e.parentNode.removeAttribute("data-err");
    e.setCustomValidity("");
  }
};
let checkConsecutive = (strings) => {
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
let loadFunc = () => {
  document.getElementById("username").addEventListener("input", event => {
    //console.log(event.target.parentNode);
    let e = event.target;
    if (!/^[a-z\d_\-.]+$/i.test(e.value)) errMsg(e, "Usernames can only contain letters, numbers, _, -, .");
    else errMsg(e);
  });
  document.getElementById("password").addEventListener("input", event => {
    let e = event.target;
    let pass = e.value;
    if (/[^\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]/i.test(pass)) errMsg(e, "Illegal character detected");
    else if (/pass?word/i.test(pass)) errMsg(e, "Don't use the word \"password\"");
    else if (/(.)\1{2,}/.test(pass)) errMsg(e, "Don't use the same character repeatedly");
    else if (checkConsecutive(pass.match(/\d{3,}/g))) errMsg(e, "Don't use consecutive numbers");
    else if (checkConsecutive(pass.match(/[a-z]{3,}/gi))) errMsg(e, "Don't use consecutive letters");
    else if (!/[a-z]/i.test(pass)) errMsg(e, "Password must contain a letter");
    else if (!/\d/.test(pass)) errMsg(e, "Password must contain a number");
    else if (/^[a-z\d]*$/i.test(pass)) errMsg(e, "Password must contain a special character");
    else if (/^.{0,5}$/.test(pass)) errMsg(e, "Password must be at least 6 characters long");
    else errMsg(e);
  });
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
  document.getElementById("showPass").addEventListener("mousedown", show);
  document.getElementById("showPass").addEventListener("mouseup", hide);
  document.getElementById("showPass").addEventListener("mouseleave", hide);
  document.getElementById("Layer_1").addEventListener("click", () => {
    boxColor();
  });
  window.addEventListener("colorChange", () => {
    eyeColor();
  });
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    let usernameElement = document.getElementById("username");
    let username = usernameElement.value;
    usernameElement.setAttribute("required", "required");
    if (!username) errMsg(usernameElement, "Username is reqired");
    let passwordElement = document.getElementById("password");
    let password = passwordElement.value;
    passwordElement.setAttribute("required", "required");
    if (!password) errMsg(passwordElement, "Password is required");
    if (!document.querySelector(":invalid")) {
      //valid
       
    }
    if (/^(?=[\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]{6,}$)(?=.*[a-z])(?=.*\d)(?=.*[^a-z\d])(?!.*pass?word)(?!.*(.)\1{2,}).*/i.test(pass) && !checkConsecutive(pass.match(/\d{3,}/g) && !checkConsecutive(pass.match(/[a-z]{3,}/gi)))) {

    }
  };
};

if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);
if (window.themeReady) themeFunc();
else window.addEventListener("themeReady", themeFunc);