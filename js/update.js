console.log("update");
if (document.getElementById("password")) {
  console.log("password");
  document.getElementById("oldPassword").addEventListener("input", () => { tbInit("oldPassword"); });
  document.getElementById("confirmPassword").addEventListener("input", () => { tbInit("confirmPassword"); });
  document.getElementById("password").addEventListener("input", event => {
    console.log("edit");
    let e = event.target;
    console.log(e);
    let pass = e.value;
    console.log(pass);
    let confirm = document.getElementById("confirmPassword");
    if (!pass) e.error = "Password is required";
    else if (/[^\w!@#$%^&*()\-+`~\\|\[\]{};:'",.\/?=]/i.test(pass)) { e.error = "Illegal character detected"; console.log("bar"); }// the console log runs but not the error
    else if (/pass?word/i.test(pass)) e.error =  "Don't use the word \"password\"";
    else if (/(.)\1{2,}/.test(pass)) e.error = "Don't use the same character repeatedly";
    else if (checkConsecutive(pass.match(/\d{3,}/g))) e.error = "Don't use consecutive numbers";
    else if (checkConsecutive(pass.match(/[a-z]{3,}/gi))) e.error = "Don't use consecutive letters";
    else if (!/[a-z]/i.test(pass)) e.error = "Password must contain a letter";
    else if (!/\d/.test(pass)) e.error = "Password must contain a number";
    else if (/^[a-z\d]*$/i.test(pass)) e.error = "Password must contain a special character";
    else if (/^.{0,5}$/.test(pass)) { e.error = "Password must be at least 6 characters long"; console.log("his ran"); }
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
}
else if (document.getElementById("email")) {

}
else console.log("other");