window.load = (piece) => {
  let countdown;
  if (/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/.test(piece)) countdown = true;
  else countdown = false;
  const element = document.getElementById(countdown ? "countdown" : piece);
  fetch("/countdown/pieces/" + piece, {
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
      element.innerHTML = res;
    })
    .then(() => {
      if (piece === "list") {
        for (let e of document.querySelectorAll(":not(#list-title) > .date")) {
          e.innerHTML = new Date(...JSON.parse(e.innerHTML)).toLocaleDateString();
        }
      }
      else if (countdown) {
        const name = document.getElementById("event_name").innerHTML;
        document.getElementsByTagName("h1")[0].innerHTML = name;
        document.getElementsByTagName("title")[0].innerHTML = name + "Countdown";
      }
    })
    .then(() => {
      const e = document.createElement("script");
      e.src = countdown ? `/js/countdownV4/countdownV4.js` : `/js/countdownV4/${piece}.js`;
      element.appendChild(e);
    });
};