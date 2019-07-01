//jshint esversion:6
let loadFunc = () => {
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    let { usernameElement, username, passwordElement, password } = confirmInit();
    
    if (/^[\w\-.]{1,50}$/.test(username) && /^(?=[\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]{6,100}$)(?=.*[a-z])(?=.*\d)(?=.*[^a-z\d])(?!.*pass?word)(?!.*(.)\1{2,})/i.test(password) && !checkConsecutive(password.match(/\d{3,}/g)) && !checkConsecutive(password.match(/[a-z]{3,}/gi))) {
      document.getElementById("button").parentNode.removeAttribute("data-err");
      modal.open("#loadingModal");
      window.activateLoading();
      fetch("/api/users/confirm" + location.search, {
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
        if (res.ok) location.assign(new URLSearchParams(location.search).get("u"));
        else if (res.status === 401) errMsg(usernameElement, "No such user");
        else if (res.status === 403) passwordElement.parentNode.setAttribute("data-err", "Incorrect password");
      })
      .then(() => modal.close())
      .then(() => window.deactivateLoading());
    }
    else {
      document.getElementById("button").parentNode.setAttribute("data-err", "Invalid username or password");
    }
  };
  document.getElementById("passwordRecovery").addEventListener("click", () => {
    document.getElementById("content").classList.add("box");
    document.getElementById("content").innerHTML = 'Enter your username: <br><input id="usernamePassRecover" type="text">';
    document.getElementById("usernamePassRecover").onenter = event => {
      let username = event.target.value;
      if (/^[\w\-.]{1,50}$/.test(username)) {
        event.target.error.clear();
        modal.open("#loadingModal");
        window.activateLoading();
        
        fetch("/api/recover/" + username)
          .then(res => {
            if (res.ok) document.getElementById("content").innerHTML = 'You were emailed a recovery code: <br><input id="recoveryCode" type="text">';
            else throw res.status; 
          })
          .then(() => {
            document.getElementById("recoveryCode").onenter = event => {
              let code = event.target.value;
              if (/^[a-z0-9]{7}$/.test(code)) {
                modal.open("#loadingModal");
                activateLoading();
                fetch("/api/recover", {
                  body: JSON.stringify({
                    username,
                    code
                  })
                })
                  .then(res => {
                    if (res.ok) document.getElementById("content").innerHTML = 'New Password: <input id="newPassword" type="text"><br>Retype Password: <input id="passwordCheck" type="text"';
                    else throw res;
                  })
                  .then(() => {
                    
                  })
                  .catch(err => {

                  })
                  .finally(() => {

                  });
              }
            };
          })
          .catch(status => {
            if (status === 404) document.getElementById("usernamePassRecover").error = "No such user";
            else document.getElementById("usernamePassRecover").error = "Something Broke :(";
          })
          .finally(() => {
            modal.close();
            deactivateLoading();
          });
      }
      else event.target.error = "Invalid Username";
    };
  });
};

if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);