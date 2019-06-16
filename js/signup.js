//jshint esversion:6
let loadFunc = () => {
  document.getElementById("username").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) errMsg(e, "Username is required");
    else if (/[^\w\-.]/i.test(e.value)) errMsg(e, "Usernames can only contain letters, numbers, _, -, .");
    else if (/^.{50,}$/.test(e.value)) errMsg(e, "Usernames may not be longer that 50 characters");
    else errMsg(e);
  });
  document.getElementById("email").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) errMsg(e, "Email is required");
    else if (!/^[a-z0-9!#%&'*+\-\/=?^_`{|}~.]{1,64}@(?:[a-z0-9](?:[a-z0-9\d]*[a-z0-9])?\.)+[a-z0-9][a-z0-9\d]*[a-z0-9]$/i.test(e.value)) errMsg(e, "Invalid Email");
    else errMsg(e);
  });
  document.getElementById("password").addEventListener("input", event => {
    let e = event.target;
    let pass = e.value;
    let confirm = document.getElementById("confirmPassword");
    if (!pass) errMsg(e, "Password is required");
    else if (/[^\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]/i.test(pass)) errMsg(e, "Illegal character detected");
    else if (/pass?word/i.test(pass)) errMsg(e, "Don't use the word \"password\"");
    else if (/(.)\1{2,}/.test(pass)) errMsg(e, "Don't use the same character repeatedly");
    else if (checkConsecutive(pass.match(/\d{3,}/g))) errMsg(e, "Don't use consecutive numbers");
    else if (checkConsecutive(pass.match(/[a-z]{3,}/gi))) errMsg(e, "Don't use consecutive letters");
    else if (!/[a-z]/i.test(pass)) errMsg(e, "Password must contain a letter");
    else if (!/\d/.test(pass)) errMsg(e, "Password must contain a number");
    else if (/^[a-z\d]*$/i.test(pass)) errMsg(e, "Password must contain a special character");
    else if (/^.{0,5}$/.test(pass)) errMsg(e, "Password must be at least 6 characters long");
    else if (/^.{100,}$/.test(pass)) errMsg(e, "Password may not be longer that 100 characters");
    else if (pass !== confirm.value && /\S/.test(confirm.value)) errMsg(confirm, "Must match password");
    else errMsg(e);
  });
  document.getElementById("confirmPassword").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) errMsg(e, "Confirm password is required");
    else if (e.value !== document.getElementById("password").value) errMsg(e, "Must match password");
    else errMsg(e);
  });
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    document.getElementById("button").parentNode.removeAttribute("data-err");
    let {username, password, email, wait} = confirmInit();
    if (wait) document.getElementById("emailWarning").addEventListener("closed", () => { login(username, password, email); });
    else login(username, password, email);
    /*for (let e of [...event.target.children]) {
      let match = [...e.children].filter(i => i.tagName === "INPUT")[0];
      if (match) match.setAttribute("required", "required");
      if (!/\S/.test(match.value)) errMsg(match, "Field Required");
    }*/
    
  };
};
let login = (username, password, email) => {
  if (!document.querySelector("#box :invalid")) {
    document.getElementById("button").parentNode.removeAttribute("data-err");
    modal.open("#loadingModal");
    document.getElementById("loadingContainer").style.setProperty("display", "initial");
    window.activateLoading();
    fetch("/api/users/create", {
      method: "POST",
      body: JSON.stringify({
        username: username,//document.getElementById("username").value,
        password: password,//document.getElementById("password").value,
        email: email,//document.getElementById("email").value,
        color: theme.color,
        light: theme.mode
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then(res => {
        if (res.status === 201) location.assign(new URLSearchParams(location.search).get("u"));
        else if (res.status === 409) errMsg(document.getElementById("username"), "Username Taken");
        else if (res.status === 202) {
          const page = document.getElementById("content");
          
        }
        else document.getElementById("button").parentNode.setAttribute("data-err", "Something went wrong. Error code " + res.status);
      })
      .then(() => modal.close())
      .then(() => window.deactivateLoading());
  }
  else {
    document.getElementById("button").parentNode.setAttribute("data-err", "Please check over your form");
  }
};
if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);