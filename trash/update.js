if (document.getElementById("password")) {
  document.getElementById("oldPassword").addEventListener("input", () => { tbInit("oldPassword"); });
  document.getElementById("confirmPassword").addEventListener("input", () => { tbInit("confirmPassword"); });
  document.getElementById("password").addEventListener("input", event => {
    let e = event.target;
    let pass = e.value;
    let confirm = document.getElementById("confirmPassword");
    if (!/\S/.test(pass)) e.error = "Password is required";
    else if (/[^\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]/i.test(pass)) { e.error = "Illegal character detected"; }
    else if (/pass?word/i.test(pass)) e.error =  "Don't use the word \"password\"";
    else if (/(.)\1{2,}/.test(pass)) e.error = "Don't use the same character repeatedly";
    else if (checkConsecutive(pass.match(/\d{3,}/g))) e.error = "Don't use consecutive numbers";
    else if (checkConsecutive(pass.match(/[a-z]{3,}/gi))) e.error = "Don't use consecutive letters";
    else if (!/[a-z]/i.test(pass)) e.error = "Password must contain a letter";
    else if (!/\d/.test(pass)) e.error = "Password must contain a number";
    else if (/^[a-z\d]*$/i.test(pass)) e.error = "Password must contain a special character";
    else if (/^.{0,5}$/.test(pass)) { e.error = "Password must be at least 6 characters long"; }
    else if (/^.{100,}$/.test(pass)) e.error = "Password may not be longer that 100 characters";
    else if (pass !== confirm.value && /\S/.test(confirm.value)) confirm.error = "Must match password";
    else { e.error.clear(); confirm.error.clear(); }
  });
  document.getElementById("confirmPassword").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) e.error = "Confirm password is required";
    else if (e.value !== document.getElementById("password").value) e.error = "Must match password";
    else e.error.clear();
  });
  document.getElementById("box").onsubmit = event => {
    event.preventDefault();
    document.getElementById("button").parentNode.removeAttribute("data-err");
    let { oldPassword } = tbInit("oldPassword");
    let newEl = document.getElementById("password");
    newEl.setAttribute("required", "required");
    let newPass = newEl.value;
    let { confirmPassword } = tbInit("confirmPassword");
    if (newPass === confirmPassword) {
      fetch("/users", {
        method: "PUT",
        body: JSON.stringify({
          pass: oldPassword,
          updated: newPass
        })
      });
    }
    else document.getElementById("confirmPassword").error = "Must match password";
  };
}
else if (document.getElementById("email")) {

}