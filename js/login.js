//jshint esversion:6
let loadFunc = () => {
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
    if (/^[\w\-.]+$/.test(username) && /^(?=[\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]{6,}$)(?=.*[a-z])(?=.*\d)(?=.*[^a-z\d])(?!.*pass?word)(?!.*(.)\1{2,})/i.test(password) && !checkConsecutive(password.match(/\d{3,}/g) && !checkConsecutive(password.match(/[a-z]{3,}/gi)))) {
      document.getElementById("button").parentNode.removeAttribute("data-err");
      modal.open("#loadingModal");
      document.getElementById("loadingContainer").style.setProperty("display", "initial");
      window.activateLoading();
      fetch("/api/users/confirm", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      })
      .then(res => {
        if (res.ok) {

        }
        else {

        }
      })
      .then(() => modal.close());
    }
    else {
      document.getElementById("button").parentNode.setAttribute("data-err", "Invalid username or password");
    }
  };
};

if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);