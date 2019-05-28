//jshint esversion:9
const express = require("express");
const nodemailer = require("nodemailer");
const os = require("os");
const url = require("url");
const fs = require("fs");
const mime = require("mime-types");
const session = require("client-sessions");
const DB = require("./queries");

const app = express();
const port = process.env.PORT || 8080;
const testing = os.hostname().includes("DESKTOP");
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
const adminOnly = (req, res, next) => {
  if (!req.user) redirect401(req, res);
  else if (req.user.type !== "ADMIN") {
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
  cookieName: "themeCookie",
  secret: process.env.THEME_SECRET || "E170f18OfUVb2s0uq6d9nW7XHj9FzLVf",
  duration: 30 * 60 * 60 * 1000,
  activeDuration: 10 * 60 * 1000,
  httpOnly: false,
  secure: !testing,// I should probably get an ssl certificate
  ephemeral: true// This means delete the cookie when the browser is closed
}));
app.use((req, res, next) => {
  if ((req.session) ? req.session.user : false) {
    DB.user.get(req.session.user, data => {
      if (data) {
        req.user = data;
        req.session.user = data.id;
        req.themeCookie.theme = {
          color: data.theme,
          mode: data.light
        };
        res.locals.user = data;
      }
      next();
    });
  }
  else {
    next();
  }
});

module.exports = {
  app,
  nodemailer,
  port,
  testing,
  requireLogin,
  adminOnly,
  DB,
  filetype,
  fs,
  mime,
  url
};