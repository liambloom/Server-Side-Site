let loadFunc = () => {
  document.getElementById("username").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) e.error = "Username is required";
    else if (/[^\w\-.]/i.test(e.value)) e.error = "Usernames can only contain letters, numbers, _, -, .";
    else if (/^.{50,}$/.test(e.value)) e.error = "Usernames may not be longer that 50 characters";
    else e.error = "";
  });
  document.getElementById("email").addEventListener("input", event => {
    let e = event.target;
    //if (!e.value) e.error = "Email is required";
    /*else */if (!/^(?:(?:[a-z0-9!#%&'*+\-\/=?^_`{|}~.]{1,64}@(?:[a-z0-9](?:[a-z0-9\d]*[a-z0-9])?\.)+[a-z0-9][a-z0-9\d]*[a-z0-9])|)$/i.test(e.value)) e.error = "Invalid Email";
    else e.error = "";
  });
  document.getElementById("password").addEventListener("input", event => {
    let e = event.target;
    let pass = e.value;
    let confirm = document.getElementById("confirmPassword");
    if (!/\S/.test(pass)) e.error = "Password is required";
    else if (/[^\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]/i.test(pass)) e.error = "Illegal character detected";
    else if (/pass?word/i.test(pass)) e.error = "Don't use the word \"password\"";
    else if (/(.)\1{2,}/.test(pass)) e.error = "Don't use the same character repeatedly";
    else if (checkConsecutive(pass.match(/\d{3,}/g))) e.error = "Don't use consecutive numbers";
    else if (checkConsecutive(pass.match(/[a-z]{3,}/gi))) e.error = "Don't use consecutive letters";
    else if (!/[a-z]/i.test(pass)) e.error = "Password must contain a letter";
    else if (!/\d/.test(pass)) e.error = "Password must contain a number";
    else if (/^[a-z\d]*$/i.test(pass)) e.error = "Password must contain a special character";
    else if (/^.{0,5}$/.test(pass)) e.error = "Password must be at least 6 characters long";
    else if (/^.{100,}$/.test(pass)) e.error = "Password may not be longer that 100 characters";
    else if (pass !== confirm.value && /\S/.test(confirm.value)) confirm.error = "Must match password";
    else { e.error = ""; confirm.error = ""; }
  });
  document.getElementById("confirmPassword").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) e.error = "Confirm password is required";
    else if (e.value !== document.getElementById("password").value) e.error = "Must match password";
    else e.error = "";
  });
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    document.getElementById("button").parentNode.removeAttribute("data-err");
    let {username, password, email, wait} = confirmInit();
    if (wait) {
      const modalClosingCb = () => {
        login(username, password, email);
        document.getElementById("emailWarning").removeEventListener("closed", modalClosingCb);
      };
      document.getElementById("emailWarning").addEventListener("closed", modalClosingCb);
    }
    else login(username, password, email);
  };
};
let login = (username, password, email) => {
  if (!document.querySelector("#box :invalid")) {
    document.getElementById("button").parentNode.removeAttribute("data-err");
    modal.open("#loadingModal");
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
        if (res.status === 201 && !email) location.assign(new URLSearchParams(location.search).get("u"));
        else if (res.status === 201 && email) return true;
        else if (res.status === 409) errMsg(document.getElementById("username"), "Username Taken");
        else document.getElementById("button").parentNode.setAttribute("data-err", "Something went wrong. Error code " + res.status);
      })
      .then(wait => {
        //console.log(wait);
        if (wait) {
          document.getElementsByTagName("main")[0].innerHTML = "Waiting for email conformation, please check your email";
          const css = document.createElement("link");
          css.setAttribute("rel", "stylesheet");
          css.setAttribute("href", "/css/blocked.css");
          document.head.appendChild(css);
          fetch("/api/users/email")
            .then(res => {
              if (res.ok) location.assign(new URLSearchParams(location.search).get("u"));
              else if (res.status === 500) document.getElementsByTagName("main")[0].innerHTML = "Something went wrong on the server";
            });
          /*new EventSource(`/api/users/email`).onmessage = () => {
            console.log("foo");
            location.assign(new URLSearchParams(location.search).get("u"));
          };*/
          /*setInterval(() => {
            //console.log("this ran");
            fetch("/api/users/hasEmail", {
              method: "GET"
            })
              .then(res => {
                //console.log(res.status);
                if (res.ok) location.assign(new URLSearchParams(location.search).get("u"));
                else if (res.status === 500) document.getElementsByTagName("main")[0].innerHTML = "Something went wrong on the server";
              });
          }, 1000);*/
        }
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