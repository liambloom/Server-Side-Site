"use strict";
const express = require("express");
const os = require("os");
const url = require("url");
const fs = require("fs");
const session = require("client-sessions");
const serve = require("./servePage");
const icons = require("./makeIcons");
const DB = require("./queries");
const count = require("./countdown");
const forbiddenApi = require("./forbidden");
const aws = require("./aws");
const { mime } = aws;

const app = express();

const port = process.env.PORT || 8080;
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
app.use(session({
  cookieName: "forbiddenKey",
  secret: process.env.FORBIDDEN_SECRET || "3vGrBQnlKBLPHurm98a3yqn0RFIWBUIY",
  duration: 10 * 365 * 24 * 60 * 60 * 1000,
  httpOnly: !testing,
  ephemeral: false
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
app.use((req, res, next) => {
  const n = new Date();
  if (n.getMonth() === 3 && n.getDate() === 1) res.redirect(303, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  else next();
});

const site = express.Router();
const admin = express.Router();
const api = express.Router();
const countdown = express.Router();
const forbidden = express.Router();
admin.use(adminOnly);
app.use("/admin", admin);
app.use("/api", api);
app.use("/countdown", countdown);
app.use("/forbidden", forbidden);
app.use(/^(?!\/(?:api|admin|countdown|forbidden)\/)/, site);

forbidden.use(async (req, res, next) => {
  if (testing || /^\/forbidden\/permission(?:\?.*)?$/.test(req.originalUrl) || await DB.forbidden.protection(req)) next();
  else res.redirect(303, "/forbidden/permission?u=" + req.originalUrl);
});

module.exports = {
  app,
  serve,
  port,
  testing,
  requireLogin,
  adminOnly,
  testingOnly,
  DB,
  fs,
  mime,
  url,
  icons,
  site, 
  admin,
  api,
  countdown,
  forbidden,
  count,
  forbiddenApi,
  aws
};