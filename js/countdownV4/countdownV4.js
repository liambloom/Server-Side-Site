const eventTime = new Date(...JSON.parse(document.getElementById("event_time").value)).getTime();
const until = {
  get diff () {
    return eventTime - new Date().getTime();
  },
  get days () {
    return Math.floor(until.diff / 86400000);
  },
  get hours () {
    return Math.floor((until.diff % 86400000) / 3600000);
  },
  get minutes () {
    return Math.floor((until.diff % 3600000) / 60000);
  },
  get seconds () {
    return Math.floor((until.diff % 60000) / 1000);
  }
};
const forEachUnit = callback => {
  for (let i of ["days", "hours", "minutes", "seconds"]) {
    if (callback(i)) break;
  }
};
const set = name => {
  const number = until[name];
  document.querySelector(`#${name} .number`).innerHTML = number.toString();
  if (number === 1) document.querySelector(`#${name} .label`).innerHTML = name.replace(/s$/, "");
  else document.querySelector(`#${name} .label`).innerHTML = name;
  forEachUnit(i => {
    if (!until[i]) document.getElementById(i).classList.add("hidden");
    else return true;
  });
};
const countdownV4 = () => {
  forEachUnit(set);
  if (!(until.days || until.hours || until.minutes || until.seconds)) {
    document.getElementById("countdown").classList.add("done");
    document.body.classList.add("done");
    clearInterval(interval);
  }
};
countdownV4();
var interval = setInterval(countdownV4, 1000);
//if (typeof newYear === "object") newYear.init(eventTime);