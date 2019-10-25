const url = require("url");
const aws = require("./aws");
const { pool } = aws;

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);

module.exports = {
  serve (req, res) {
    let reqUrl = path(req).pathname.match(/(?<=\/)[^\/]+$/)[0];
    if (/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/.test(reqUrl)) reqUrl = "countdown";
    res.render("./countdown_beta/containers/" + reqUrl, { user: (req.user) ? req.user : false, here: req.originalUrl }, (error, html) => {
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
    now = new Date(now);
    timeObj = {};
    timeObj.time = timing.match(/^\S+/)[0];
    timeObj.timeArr = timeObj.time.split(":");
    timeObj.hour = parseInt(timeObj.timeArr[0]);
    timeObj.minute = parseInt(timeObj.timeArr[1]);
    if (timing.includes("every")) {
      switch (timing.match(/(?<=every ).*$/)[0]) {
        case "year":
          timeObj.date = timing.match(/(?<=\s)\d{2}\/\d{2}/)[0];
          timeObj.dateArr = timeObj.date.split("/");
          timeObj.params = [
            now.getFullYear(),
            parseInt(timeObj.dateArr[0]) - 1, // Month
            parseInt(timeObj.dateArr[1]), // Day
            timeObj.hour,
            timeObj.minute,
            0
          ];
          return {
            date: this.V3.findYear(new Date(...timeObj.params), now),
            params: JSON.stringify(timeObj.params)
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
  },
  test (req, res) {

  },
  render: {
    list: async function (req, res) {
      const page = "." + path(req).pathname.replace(/(?<=countdown)/, "_beta");
      let preset = await pool.query("SELECT * FROM countdowns WHERE owner = '00000000-0000-0000-0000-000000000000'");
      preset = preset.rows;
      try {
        preset.forEach(e => {
          e.timing = module.exports.nextOccurrence(e.timing, new Date(req.body.time));
          e.calendar = e.calendar.titleCase();
          e.icon = `/aws/countdown/${e.icon}`;
        });
        preset.sort((a, b) => a.timing.date.getTime() - b.timing.date.getTime());//if a > b (a happens later), this will be positive and b will be moved before a, and vice versa
        //console.log(preset);
        res.render(page, { preset }, (error, html) => {
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
        const info = await (await pool.query("SELECT * FROM countdowns WHERE id = $1", [path(req).pathname.match(/(?<=\/)[^\/]+$/)[0]])).rows[0];
        info.timing = module.exports.nextOccurrence(info.timing, new Date(req.body.time)).params;
        res.render("./countdown_beta/pieces/countdown", info, (error, html) => {
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
        module.exports.r404(req, res);
      }
    }
  },
  api: {
    
  },
  V3: {
    findYear (event, n) {
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