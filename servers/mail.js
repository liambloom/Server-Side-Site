//jshint esversion:9
const initPool = require("./initPool");
const nodemailer = require("nodemailer");
const fs = require("fs");
const uuid = require("uuid/v4");
const testing = require("os").hostname().includes("DESKTOP");
//const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const confirm = (res, email, username, theme, code, site) => {
  //const page = testing ? "https://liambloom.herokuapp.com" : `${site.protocol}//${site.host}`;
  res.render("./confirmEmail", {
    ...theme,
    username,
    code,
    site: testing ? "https://liambloom.herokuapp.com" : `${site.protocol}//${site.host}`
  }, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    }
    else {
      //if (testing) fs.writeFile("./views/sentEmail.html", html, err => { if (err) console.log(err); });
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "liamserveremail@gmail.com",
          pass: process.env.EMAIL_PASS
        }
      })
        .sendMail({
          from: "liamserveremail@gmail.com",
          to: email,
          subject: "Confirm Email for " + site.hostname,
          html: html
        }, (err, info) => {
          if (err) {
            console.error(err);
            res.status(500).end(err);
          }
          else {
            res.status(201).end();
          }
        });
    }
  });
};
module.exports = {
  mail: {
    confirm
  },
  initPool
};