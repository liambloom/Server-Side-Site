if (document.getElementById("password")) {
  var updateLoad = () => {
    document.getElementById("oldPassword").addEventListener("input", () => { tbInit("oldPassword"); });
    document.getElementById("passwordConfirm").addEventListener("input", () => { tbInit("passwordConfirm"); });
  };
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
    else { errMsg(e); errMsg(confirm); }
  });
  document.getElementById("confirmPassword").addEventListener("input", event => {
    let e = event.target;
    if (!e.value) errMsg(e, "Confirm password is required");
    else if (e.value !== document.getElementById("password").value) errMsg(e, "Must match password");
    else errMsg(e);
  });
}
else if (document.getElementById("email")) {
  var updateLoad = () => {

  };
}

if (document.readyState === "complete") updateLoad();
else window.addEventListener("load", updateLoad);