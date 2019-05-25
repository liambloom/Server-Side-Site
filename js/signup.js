//jshint esversion:6
let loadFunc = () => {
  document.getElementById("username").addEventListener("input", event => {
    let e = event.target;
    if (/[^\w\-.]/i.test(e.value)) errMsg(e, "Usernames can only contain letters, numbers, _, -, .");
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
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    for (let e of [...event.target.children]) {
      let match = [...e.children].filter(i => i.tagName === "INPUT")[0];
      if (match) match.setAttribute("required", "required");
      if (!/\S/.test(match.value)) errMsg(match, "Field Required");
    }
    if (!document.querySelector("#box :invalid")) {
      document.getElementById("button").parentNode.removeAttribute("data-err");
      modal.open("#loadingModal");
      document.getElementById("loadingContainer").style.setProperty("display", "initial");
      window.activateLoading();
      fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify({
          username: document.getElementById("username").value,
          password: document.getElementById("password").value
        }),
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      })
      .then(res => {
        if (res.ok) {
          document.getElementById("content").innerHTML = "Thank you for signing up!";
        }
        else {
          document.getElementById("button").parentNode.setAttribute("data-err", "Something went wrong. Error code " + res.status);
          console.error(res.error);
        }
      })
      .then(() => modal.close());
    }
    else {
      document.getElementById("button").parentNode.setAttribute("data-err", "Please check over your form");
    }
  };
};
if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);