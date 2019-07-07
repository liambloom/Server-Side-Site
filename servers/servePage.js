//jshint esversion:9
const { fs, mime, filetype, url, DB } = require("./init");

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);


const serve = (req, res) => {
  try {
    const page = "." + path(req).pathname.replace(/\/$/, "/index");
    let type = filetype(page);
    if (Array.isArray(type)) type = type[0];
    //If not ejs
    if (type) {
      fs.readFile(page, (err, data) => {
        if (data) {
          // On success, serve page
          res.writeHead(200, { "Content-Type": mime.contentType(type) });
          res.write(data);
          res.end();
        }
        else {
          // On failure, serve simple text 404
          res.writeHead(404, { "Content-Type": "text/html" });
          res.write(`The page ${path(req).href} could not be found<br>${err}`);
          res.end();
        }
      });
    }
    //if ejs
    else {
      res.render(page, { user: (req.user) ? req.user : false, here: req.originalUrl }, (error, html) => {
        if (html) {
          // On success, serve page
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(html);
          res.end();
        }
        else {
          // On failure, serve 404
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
        }
      });
    }
  }
  catch (err) {
    try {
      res.writeHead(500, { "Content-Type": "text/html" });
    }
    catch (err) {}
    res.write(`Uh Oh! Something Broke :( <br>${err}`);
    res.end();
    console.error(err);
  }
};
serve.themes = (req, res) => {
  fs.readFile("./json/themes.json", (err, data) => {
    if (data) {
      if (req.user) {
        data = JSON.parse(data);
        data.user = {
          color: req.user.color,
          mode: req.user.light
        };
        data = JSON.stringify(data);
      }
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.write(data);
      res.end();
    }
    else {
      res.writeHead(500, { "Content-Type": "text/html" });
      res.write(`Uh Oh! Something Broke :( <br>${err}`);
      res.end();
    }
  });
};
serve.update = (req, res) => {
  res.locals.category = req.params.category;
  serve(req, res);
};
module.exports = serve;