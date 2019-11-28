const  eventTime = new Date(...JSON.parse(document.getElementById("event_time").value)).getTime();
const now = new Date().getTime();
const diff = eventTime - now;
const until = {};
until.days = Math.floor(diff / 86400000);
until.hours = Math.floor((diff % 86400000) / 3600000);
until.minutes = Math.floor((diff % 3600000) / 60000);
until.seconds = Math.floor((diff % 60000) / 1000);

const set = (bool, name) => {
  //let bool = until[name]--; Won't work because of initial setting
  let number = until[name];
  console.log(number);
  if (number < 0) {
    switch (name) {
      case "seconds":
      case "minutes":
        number = until[name] = 59;
        break;
      case "hours":
        number = until[name] = 23;
        break;
      default:
        console.log("uh oh!", bool, number, name);
    }
  }
  console.log(number);
  if (bool) {
    document.querySelector(`#${name} .number`).innerHTML = number.toString();
    if (number === 1) document.querySelector(`#${name} .label`).innerHTML = name.replace(/s$/, "");
    else document.querySelector(`#${name} .label`).innerHTML = name;
  }
<<<<<<< HEAD
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
=======
  if (!bool) document.getElementById(name).classList.add("hidden");
  else document.getElementById(name).classList.remove("hidden");
  return bool - 1;
};
const countdownV4 = first => {
  if (first) set(set(set(set(until.days > 0, "days") || until.hours > 0, "hours") || until.minutes > 0, "minutes") || until.seconds > 0, "seconds");
  else if (!(set(until.seconds-- || set(until.minutes-- || set(until.hours-- || set(until.days--, "days"), "hours"), "minutes"), "seconds"))) {
    //setTimeout(() => {
      document.getElementById("countdown").classList.add("done");
      document.body.classList.add("done");
      clearInterval(interval);
    //}, 1000);
>>>>>>> parent of 49f4d45... Revert "Update countdownV4.js"
  }
};
countdownV4(true);
var interval = setInterval(countdownV4, 1000);
if (typeof newYear === "object") newYear.init(eventTime);