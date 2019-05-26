//jshint esversion:9
const url = require("url");
const fs = require("fs");
const mime = require("mime-types");

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const filetype = req => req.match(/(?<=\.)[^.\/]+$/);

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
      res.render(page, (error, html) => {
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
              res.write(html);
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
    res.writeHead(500, { "Content-Type": "text/html" });
    res.write(`Uh Oh! Something Broke :( <br>${err}`);
    res.end();
    console.error(err);
  }
};
module.exports = serve;