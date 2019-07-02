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
        else if (res.status === 401) usernameElement.error = "No such user";
        else if (res.status === 403) passwordElement.parentNode.setAttribute("data-err", "Incorrect password");
      })
      .then(() => modal.close())
      .then(() => window.deactivateLoading());
    }
    else {
      document.getElementById("button").parentNode.setAttribute("data-err", "Invalid username or password");
    }
  };
  if (document.getElementById("passwordRecovery")) {
    document.getElementById("passwordRecovery").addEventListener("click", () => {
      document.getElementById("content").classList.add("box");
      document.getElementById("content").innerHTML = 'Enter your username: <br><input id="usernamePassRecover" type="text">';
      document.getElementById("usernamePassRecover").onenter = event => {
        let username = event.target.value;
        if (/^[\w\-.]{1,50}$/.test(username)) {
          event.target.error.clear();
          modal.open("#loadingModal");
          window.activateLoading();
          
          fetch("/api/recover", {
            method: "POST",
            body: {
              username
            }
          })
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
                      if (res.ok) document.getElementById("content").innerHTML = 'New Password: <span><input id="newPassword" type="text"></span><br>Retype Password: <span><input id="passwordCheck" type="text"></span>';
                      else throw res;
                    })
                    .then(() => {
                      document.getElementById("newPassword").addEventListener("input", event => {
                        let e = event.target;
                        let pass = e.value;
                        let confirm = document.getElementById("confirmPassword");
                        if (!pass) e.error = "Password is required";
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
                        else { e.error.clear(); confirm.error.clear(); }
                      });
                      document.getElementById("passwordCheck").addEventListener("input", event => {
                        let e = event.target;
                        if (!e.value) e.error = "Confirm password is required";
                        else if (e.value !== document.getElementById("password").value) e.error = "Must match password";
                        else e.error.clear();
                      });
                      document.getElementById("content").addEventListener("enter", () => {
                        if (!document.querySelector("#content :invalid")) {
                          fetch("/api/recover", {
                            method: "PUT",
                            body: {
                              username,
                              code,
                              password: document.getElementById("newPassword").value
                            }
                          })
                            .then(res => {
                              if (res.ok) location.assign(new URLSearchParams(location.search).get("u"));
                              else throw res;
                            });
                        }
                      });
                    })
                    .catch(() => {
                      document.getElementById("newPassword").parentNode.error = "Something Broke :(";
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
  }
};

if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);