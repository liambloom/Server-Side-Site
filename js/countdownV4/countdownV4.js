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
  }
};
countdownV4(true);
var interval = setInterval(countdownV4, 1000);
if (typeof newYear === "object") newYear.init(eventTime);