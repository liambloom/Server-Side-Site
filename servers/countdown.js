const url = require("url");
const aws = require("./aws");
const { pool } = aws;

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);

module.exports = {
  new (req, res) {
    console.log("new ran");
    res.write("new ran");
    res.end();
  },
  my (req, res) {
    console.log("my ran");
    res.write("my ran");
    res.end();
  },
  my1 (req, res) {
    console.log("my1 ran");
    res.write("my1 ran");
    res.end();
  },
  id (req, res, next) {
    console.log("id ran");
    /*res.write("id ran");
    res.end();*/
    next();
  },
  listTest: function (req, res) {
    res.render("./countdown/listTest", { user: (req.user) ? req.user : false, here: req.originalUrl }, (error, html) => {
      if (html) {
        // On success, serve page
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
      else {
        // On failure, serve 404
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
    timeObj.hour = timeObj.timeArr[0];
    timeObj.minute = timeObj.timeArr[1];
    if (timing.includes("every")) {
      switch (timing.match(/(?<=every ).*$/)[0]) {
        case "year":
          timeObj.date = timing.match(/(?<=\s)\d{2}\/\d{2}/)[0];
          timeObj.dateArr = timeObj.date.split("/");
          timeObj.month = parseInt(timeObj.dateArr[0]) - 1;
          timeObj.day = parseInt(timeObj.dateArr[1]);
          return this.V3.findYear(new Date(now.getFullYear(), timeObj.month, timeObj.day, timeObj.hour, timeObj.minute, 0), now);
      }
    }
  },
  render: {
    list: async function (req, res) {
      const page = "." + path(req).pathname.replace(/\/$/, "/index");
      let preset = await pool.query("SELECT * FROM countdowns WHERE owner = '00000000-0000-0000-0000-000000000000'");
      preset = preset.rows;
      try {
        preset.forEach(e => {
          e.timing = module.exports.nextOccurrence(e.timing, new Date(req.body.time));
          e.calendar = e.calendar.titleCase();
          e.icon = `/aws/countdown/${e.icon}.png`;//data[`countdown/${e.icon}.png`].Body.toString("base64");
        });
        preset.sort((a, b) => a.timing.getTime() - b.timing.getTime());//if a > b (a happens later), this will be positive and b will be moved before a, and vice versa
        console.log(
          preset/*.map(e => {
            clone = JSON.parse(JSON.stringify(e));
            clone.icon = "icon here";
            return clone;
          })*/
        );
        res.render(page, { user: (req.user) ? req.user : false, here: req.originalUrl, preset: JSON.stringify(preset)}, (error, html) => {
          if (html) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
          else {
            console.error(err);
            serve.return404(req, res);
          }
        });
      }
      catch (err) {
        console.error(err);
        res.write(err.toString());
        res.end();
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
    }
  }
};