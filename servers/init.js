"use strict";
const express = require("express");
const os = require("os");
const url = require("url");
const fs = require("fs");
const mime = require("mime-types");
const session = require("client-sessions");
const { mail } = require("./mail");
const icons = require("./makeIcons");
const DB = require("./queries");
const countApi = require("./countdown");

const app = express();

const testing = os.hostname().includes("DESKTOP");
const port = process.env.PORT || (process.env.SENDGRID_API_KEY ? 8090 : 8080);
const filetype = req => req.match(/(?<=\.)[^.\/]+$/);
const redirect401 = (req, res) => {
  res.render("./blocked", { user: (req.user) ? req.user : false, here: req.originalUrl, title: "401 Unauthorized", msg: `Please <a href="/login?u=${req.originalUrl}">log in</a> or <a href="/signup?u=${req.originalUrl}">sign up</a> to view this content` }, (err, html) => {
    if (html) {
      res.writeHead(401, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    }
    else {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.write(`Uh Oh! Something Broke :( <br>${err}`);
      res.end();
    }
  });
};
const requireLogin = (req, res, next) => {//To use this: app.get("/somewhere", requireLogin, (req, res) => server("/somewhere")) - this will only be served if user is logged in
  if (!req.user) redirect401(req, res);
  else next();
};
var adminOnly = (req, res, next) => {
  if (req.user ? req.user.type !== "ADMIN" : true) {
    res.render("./blocked", { user: (req.user) ? req.user : false, here: req.originalUrl, title: "403 Forbiden", msg: "This is admin only content" }, (err, html) => {
      if (html) {
        res.writeHead(403, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
      else {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.write(`Uh Oh! Something Broke :( <br>${err}`);
        res.end();
      }
    });
  }
  else next();
};
const testingOnly = (req, res, next) => {
  if (testing) next();
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.write(`The page ${path(req).href} could not be found`);
    res.end();
  }
};

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  cookieName: "session",
  secret: process.env.SECRET || "L6WpMp3EJLroE9YtzXLoYr5pU2enJSSj",
  duration: 30 * 60 * 60 * 1000,
  activeDuration: 10 * 60 * 1000,
  httpOnly: true,
  secure: !testing,// I should probably get an ssl certificate
  ephemeral: true// This means delete the cookie when the browser is closed
}));
app.use(async (req, res, next) => {
  if ((req.session) ? req.session.user : false) {
    const userId = await DB.session.get(req.session.user);
    if (userId) {
      let data = await DB.user.get(userId);
      if (data) {
        req.user = data;
        req.session.user = req.session.user;
        res.locals.user = data;
      }
      next();
    }
    else next();
  }
  else next();
});

const site = express.Router();
const admin = express.Router();
const api = express.Router();
const countdown = express.Router();
admin.use(adminOnly);
app.use("/admin", admin);
app.use("/api", api);
app.use("/countdown", countdown);
app.use(/^(?!\/(?:api|admin|countdown))/, site);

module.exports = {
  app,
  port,
  testing,
  requireLogin,
  adminOnly,
  testingOnly,
  DB,
  filetype,
  fs,
  mime,
  url,
  mail,
  icons,
  site, 
  admin,
  api,
  countdown,
  countApi
};