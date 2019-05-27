//jshint esversion:9
const express = require("express");
const nodemailer = require("nodemailer");
const serve = require("./servePage");
const DB = require("./queries");
const session = require("client-sessions");
const os = require("os");

const app = express();
const port = process.env.PORT || 8080;
const testing = os.hostname().includes("DESKTOP");
const requireLogin = (req, res, next) => {//To use this: app.get("/somewhere", requireLogin, (req, res) => server("/somewhere")) - this will only be served if user is logged in
  if (!req.user) res.redirect("/login?u=" + req.originalUrl);
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
app.use((req, res, next) => {
  if ((req.session) ? req.session.user : false) {
    DB.user.get(req.session.user, data => {
      if (data) {
        req.user = data;
        req.session.user = data.id;
        res.locals.user = data;
      }
      next();
    });
  }
  else {
    next();
  }
});

app.post("/api/sugestion", (req, res) => {
  res.render("./email", {
    offWhite: req.body.theme.offWhite,
    offBlack: req.body.theme.offBlack,
    txt: req.body.theme.headTextColor,
    light: req.body.theme.gradientLight,
    data: `
      ${new Date(req.body.timestamp).toString().replace(/\s\([^()]+\)/, "")}
      <br>
      <br>
      ${req.body.data.replace(/\n/g, "<br>")}
    `
  }, (err, html) => {
    if (err) {
      console.log(err);
    }
    else {
      page = html;
    }
  });
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "liamserveremail@gmail.com",
      pass: "imaServer"
    }
  })
  .sendMail({
    from: "liamserveremail@gmail.com",
    to: "liamrbloom@gmail.com",
    subject: "Here's a sugestion",
    html: page
  }, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    else {
      res.status(200);
      res.write(info.response);
      res.end();
    }
  });
});

app.get("/api/users/:id", DB.user.get);
app.post("/api/users/create", DB.user.create);
app.post("/api/users/confirm", DB.user.confirm);
//app.put("api/users/:id", DB.user.update);
//app.delete("/api/users/:id", DB.user.delete);
app.get("/logout", DB.user.logout);

app.get(/^(?!\/(?:non-existentPage))/, serve);
app.get(/\/(?:non-exsitentPage)/, requireLogin, serve);

app.listen(port, () => { 
  DB.createTable();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});