const DB = require("./queries");
const url = require("url");
const aws = require("./aws");

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const r404 = (req, res) => {
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
};

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
  r404 (req, res) {
    console.log("r404 ran");
    res.render("./404", { target: path(req).href }, (error, html) => {
      if (html) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
      else {
        // If 404 is broken, serve 500
        res.writeHead(500, { "Content-Type": "text/html" });
        res.write(`The page ${path(req).href} could not be found <br>${error}`);
        res.end();
      }
    });
  },
  render: {
    list: async function (req, res) {
      //const page = "." + path(req).pathname.replace(/\/$/, "/index");
      try {
        const firework = await aws.getObject("countdown/fireworks-gold.svg");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(firework.Body);
        res.end();
      }
      catch (err) {
        res.write(err.toString());
        res.end();
      }
      /*res.render(page, { user: (req.user) ? req.user : false, here: req.originalUrl }, (error, html) => {
        if (html) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(html);
          res.end();
        }
        else {
          serve.return404(req, res);
        }
      });*/
    }
  },
  api: {
    
  }
};