const list = document.getElementById("list");
fetch("/countdown/list", {
  method: "POST",
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