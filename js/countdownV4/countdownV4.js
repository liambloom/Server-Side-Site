let eventTime = new Date(...JSON.parse(document.getElementById("event_time").value)).getTime();
const set = (bool, number, name) => {
  if (bool) {
    document.querySelector(`#${name} .number`).innerHTML = number.toString();
    if (number === 1) document.querySelector(`#${name} .label`).innerHTML = name.replace(/s$/, "");
    else document.querySelector(`#${name} .label`).innerHTML = name;
  }
  else document.getElementById(name).classList.add("hidden");
  return bool;
};
const countdownV4 = first => {
  const now = new Date().getTime();
  const diff = eventTime - now;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (first) set(set(set(set(days, days, "days") || hours, hours, "hours")|| minutes, minutes, "minutes") || seconds, seconds, "seconds");
  else set(seconds || seconds !== 59 || set(minutes !== 59 || set(hours !== 23 || set(days, days, "days"), hours, "hours"), minutes, "minutes"), seconds, "seconds")
  if (!(days || hours || minutes || seconds)) {
    document.getElementById("countdown").classList.add("done");
    document.body.classList.add("done");
    clearInterval(interval);
  }
};
countdownV4(true);
var interval = setInterval(countdownV4, 1000);
if (typeof newYear === "object") newYear.init(eventTime);