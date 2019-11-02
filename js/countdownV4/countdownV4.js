let eventTime = new Date(...JSON.parse(document.getElementById("event_time").value)).getTime();
const set = (bool, number, name) => {
  if (bool) {
    document.querySelector(`#${name} .number`).innerHTML = number.toString();
    if (number === 1) document.querySelector(`#${name} .label`).innerHTML = name.replace(/s$/, "");
    else document.querySelector(`#${name} .label`).innerHTML = name;
  }
  else document.getElementById(name).classList.add("hide");
  return bool;
};
const countdownV4 = first => {
  const now = new Date().getTime();
  const diff = eventTime - now;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (first) set(set(set(set(days > 0, days, "days") || hours > 0, hours, "hours")|| minutes > 0, minutes, "minutes") || seconds > 0, seconds, "seconds");
  else if (!set(seconds > 0 || set(minutes > 0 || set(hours > 0 || set(days > 0, days, "days"), hours, "hours"), minutes, "minutes"), seconds, "seconds")) {
    document.getElementById("countdown").classList.add("done");
    clearInterval(interval);
  }
};
countdownV4(true);
var interval = setInterval(countdownV4, 1000);
if (typeof newYear === "object") newYear.init(eventTime);