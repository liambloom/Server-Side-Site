const list = document.getElementById("list");
fetch("/countdown/list", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8"
  },
  body: JSON.stringify({
    time: new Date().getTime()
  })
})
  .then(res => res.text())
  .then(res => {
    list.innerHTML = res;
  })
  .then(() => {
    const e = document.createElement("script");
    e.src = "/js/countdownV4/list.js";
    list.appendChild(e);
  });