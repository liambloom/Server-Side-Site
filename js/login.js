//jshint esversion:6
let loadFunc = () => {
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    let { usernameElement, username, passwordElement, password } = confirmInit();
    
    if (/^[\w\-.]+$/.test(username) && /^(?=[\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]{6,}$)(?=.*[a-z])(?=.*\d)(?=.*[^a-z\d])(?!.*pass?word)(?!.*(.)\1{2,})/i.test(password) && !checkConsecutive(password.match(/\d{3,}/g)) && !checkConsecutive(password.match(/[a-z]{3,}/gi))) {
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
          console.log("good");
        }
        else if (res.status === 401) document.getElementById("button").parentNode.setAttribute("data-err", "No such user");
        else if (res.status === 403) document.getElementById("button").parentNode.setAttribute("data-err", "Incorrect password");
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