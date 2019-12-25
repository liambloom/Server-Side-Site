const url = require("url");
const aws = require("./aws");
const { pool, uuid } = aws;

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);

module.exports = {
  serve (req, res) {
    let reqUrl = path(req).pathname.match(/(?<=countdown\/).+$/)[0];
    if (/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}|test/.test(reqUrl)) reqUrl = "countdown";
    res.render("./countdown/containers/" + reqUrl, { user: (req.user) ? req.user : false, here: req.originalUrl }, (error, html) => {
      if (html) {
        // On success, serve page
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
      else {
        // On failure, serve 404d
        console.error(error);
        module.exports.r404(req, res);
      }
    });
  },
  r404 (req, res) {
    res.render("./404", { target: path(req).href }, (error404, html404) => {
      if (html404) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(html404);
        res.end();
      }
      else {
        // If 404 is broken, serve 500
        res.writeHead(500, { "Content-Type": "text/html" });
        res.write(`The page ${path(req).href} could not be found <br>${error404}`);
        res.end();
      }
    });
  },
  nextOccurrence (timing, now) {
    console.log(now, timing, "countdown.js:41 module.exports.nextOccurrence");
    now = new Date(now);
    console.log(now, timing, "countdown.js:43 module.exports.nextOccurrence");
    const timeObj = {};
    timeObj.time = timing.match(/^\S+/)[0];
    timeObj.timeArr = timeObj.time.split(":");
    timeObj.hour = parseInt(timeObj.timeArr[0]);
    timeObj.minute = parseInt(timeObj.timeArr[1]);
    if (timing.includes("after")) {
      const [after, base] = timing.split(/(?<=\s*after)\s*/);
      timeObj.nth = parseInt(after.match(/\b\d(?=st|nd|rd|th)/)[0]);
      timeObj.weekDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(after.match(/\b\S{3}(?= after)/)[0].toLowerCase());
      const relative = this.after(now, base, timeObj);
      return {
        date: relative,
        params: JSON.stringify([
          relative.getFullYear(),
          relative.getMonth(),
          relative.getDate(),
          relative.getHours(),
          relative.getMinutes(),
          0
        ])
      };
    }
    else if (timing.includes("every")) {
      switch (timing.match(/(?<=every ).*$/)[0]) {
        case "year":
          console.log(now, timing, timeObj, "countdown.js:69 module.exports > nextOccurrence > every > year");
          timeObj.date = timing.match(/(?<=\s)\d{2}\/\d{2}/)[0];
          timeObj.dateArr = timeObj.date.split("/");
          console.log(now, timing, timeObj, "countdown.js:72 module.exports > nextOccurrence > every > year");
          const next = this.V3.findYear(new Date(
            now.getFullYear(),
            parseInt(timeObj.dateArr[0]) - 1, // Month
            parseInt(timeObj.dateArr[1]), // Day
            timeObj.hour,
            timeObj.minute,
            0
          ), now);
          return {
            date: next,
            params: JSON.stringify([
              next.getFullYear(),
              next.getMonth(),
              next.getDate(),
              next.getHours(),
              next.getMinutes(),
              0
            ])
          };
      }
    }
    else if (timing.includes("of")) {
      timeObj.month = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].indexOf(timing.match(/(?<=of ).*$/)[0].toLowerCase());
      timeObj.weekDay = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(timing.match(/\b\S{3}(?= of)/)[0].toLowerCase());
      const getNth = (year) => {
        if (timing.includes("last")) return this.V3.findLast(year, timeObj.month, timeObj.weekDay);
        else {
          timeObj.nth = parseInt(timing.match(/\b\d(?=st|nd|rd|th)/)[0]);
          return this.V3.findDay(year, timeObj.month, timeObj.weekDay, timeObj.nth);
        }
      };
      let next = getNth(now.getFullYear());
      next.setHours(timeObj.hour);
      next.setMinutes(timeObj.minute);
      if (!(next.getTime() > now.getTime())) next = getNth(now.getFullYear() + 1);
      return {
        date: next,
        params: JSON.stringify([
          next.getFullYear(),
          next.getMonth(),
          next.getDate(),
          next.getHours(),
          next.getMinutes(),
          0
        ])
      };
    }
    else {
      timing = timing.split(/:|\s|\//g);
      const params = [timing[4], parseInt(timing[2]) - 1, timing[3], timing[0], timing[1]];
      return {
        date: new Date(...params),
        params: JSON.stringify(params)
      };
    }
  },
  after (now, base, timeObj, goBack = true) {
    let relative = new Date(now);
    relative.setDate(now.getDate() + (goBack ? (-timeObj.nth * 7) : 0));
    relative = this.nextOccurrence(base, relative).date;
    relative.setDate(relative.getDate() + timeObj.nth * 7 - 6);
    while (relative.getDay() !== timeObj.weekDay) {
      relative.setDate(relative.getDate() + 1);
    }
    if (relative.getTime() > now.getTime()) return relative;
    else if (goBack) return this.after(now, base, timeObj, false);
    else return "error";
  },
  render: {
    list: async function (req, res) {
      console.log(req.body.now, "countdown.js:143 module.exports > list > render");
      const page = "." + path(req).pathname;//.replace(/(?<=countdown)/, "_beta");
      let preset = await pool.query("SELECT * FROM countdowns WHERE owner = '00000000-0000-0000-0000-000000000000'");
      preset = preset.rows;
      let custom = [];
      if (req.user) {
        custom = await pool.query("SELECT * FROM countdowns WHERE owner = $1", [req.user.id]);
        custom = custom.rows;
      }
      try {
        for (let list of [preset, custom]) {
          for (let e of list) {
            e.timing = module.exports.nextOccurrence(e.timing, new Date(req.body.time));
            if (e.timing.date.getTime() < new Date(req.body.time).getTime()) { // This doesn't quite work, and threw an error when there were multiple past countdowns
              list.splice(list.indexOf(e), 1);
              pool.query("DELETE FROM countdowns WHERE id = $1", [e.id]);
              continue;
            }
            e.calendar = e.calendar.titleCase();
            e.icon = `/aws/countdown/icons/${e.icon}`;
          }
          list.sort((a, b) => a.timing.date.getTime() - b.timing.date.getTime());//if a > b (a happens later), this will be positive and b will be moved before a, and vice versa
        }
        console.log(!!req.user);
        res.render(page, { lists: { preset, custom }, user: !!req.user }, (error, html) => {
          if (html) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
          else {
            console.error(error);
            module.exports.r404(req, res);
          }
        });
      }
      catch (err) {
        console.error(err);
        res.write(err.toString());
        res.end();
      }
    },
    countdown: async function (req, res) {
      try {
        let info, next;
        const id = path(req).pathname.match(/(?<=\/)[^\/]+$/)[0];
        if (id === "test") {
          const testTime = new Date(req.body.time);
          testTime.setSeconds(testTime.getSeconds() + 5);
          info = {
            bg: "fireworks.gif",
            name: "Test",
            message: "It Worked!",
            icon: "/img/Countdowns/clock.svg"
          };
          next = {
            date: testTime,
            params: JSON.stringify([
              testTime.getFullYear(),
              testTime.getMonth(),
              testTime.getDate(),
              testTime.getHours(),
              testTime.getMinutes(),
              testTime.getSeconds(),
              testTime.getMilliseconds()
            ])
          };
        }
        else {
          info = await (await pool.query("SELECT * FROM countdowns WHERE id = $1", [id])).rows[0];
          next = module.exports.nextOccurrence(info.timing, new Date(req.body.time));
          info.icon = "/aws/countdown/icons/" + info.icon;
        }
        info.timing = next.params;
        if (info.id === "0d70045b-b5af-4daf-84a5-1f8892bed617") info.name = next.date.getFullYear();
        res.render("./countdown/pieces/countdown", info, (error, html) => {
          if (html) {
            // On success, serve page
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
          else {
            // On failure, serve 404d
            console.error(error);
            module.exports.r404(req, res);
          }
        });
      }
      catch (err) {
        console.error(err);
        module.exports.r404(req, res);
      }
    }
  },
  async newCountdown (req, res) {
    try {
      const countdownId = uuid();
      let iconId;
      if (req.body.icon !== "clock.svg") {
        iconId = `${uuid()}.${req.body.iconType}`;
        console.log(iconId);
        await aws.upload(Buffer.from(req.body.icon), `countdown/icons/${iconId}`); // idk if this works
      }
      else iconId = "clock.svg";
      await pool.query("INSERT INTO countdowns VALUES ($1, $2, 'gregorian', $3, 'placeholder', $4, $5, $6)", [countdownId, req.body.name, iconId, req.user.id, req.body.timing, req.body.message]);

      res.writeHead(202, { "Content-Type": "application/json; charset=utf-8" });
      res.write(JSON.stringify({id: countdownId}));
      res.end();
    }
    catch (err) {
      handle(err, res);
    }
  },
  V3: {
    findYear (event, n) {
      console.log(n, event, "countdown.js:260 module.exports > V3 > findYear");
      if (event.getTime() < n.getTime()) {
        event.setFullYear(event.getFullYear() + 1);
        return event;
      }
      else {
        return event;
      }
    },
    findDay (year, month, dayToFind, nth) {
      const finder = new Date(year, month, nth * 7 - 6);
      while (finder.getDay() !== dayToFind) {
        finder.setDate(finder.getDate() + 1);
      }
      return finder;
    },
    findLast (year, month, dayToFind) {
      return this.findDay(year, month + 1, dayToFind, 0);
    }
  }
};