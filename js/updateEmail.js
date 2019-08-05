//console.log("this ran");
document.getElementById("update").addEventListener("input", event => { tbInit(event.target, true); });
document.getElementById("box").onsubmit = event => {
  //console.log("this ran");
  event.preventDefault();
  let { update, updateElement } = tbInit("update", true);
  updateElement.removeAttribute("data-err");
  fetch("/api/users", {
    method: "PUT",
    body: JSON.stringify({
      category: "email",
      value: update
    }),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
    .then(res => {
      if (res.ok) {
        document.getElementById("content").innerHTML = "Waiting for email conformation, please check your email";
        const css = document.createElement("link");
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("href", "/css/blocked.css");
        document.head.appendChild(css);
        fetch("/api/users/email")
          .then(res => {
            if (res.ok) location.assign(new URLSearchParams(location.search).get("u"));
            else if (res.status === 500) document.getElementById("content").innerHTML = "Something went wrong on the server";
          });
      }
      else updateElement.setAttribute("data-err", "Something went wrong");
    })
  
  
};