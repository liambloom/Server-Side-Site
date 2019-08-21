//jshint esversion:9
const initPool = require("./initPool");
const nodemailer = require("nodemailer");
const testing = require("os").hostname().includes("DESKTOP");
//const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const confirm = (res, email, username, theme, code, site) => {
  //const page = testing ? "https://liambloom.herokuapp.com" : `${site.protocol}//${site.host}`;
  res.render("./emails/confirm", {
    ...theme,
    username,
    code,
    site: `${site.protocol}//${site.host}`
  }, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    }
    else {
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
        }, (err) => {
          if (err) console.error(err);
          else res.status(201).end();
        });
    }
  });
};
const recover = (res, email, username, theme, code, site) => {
  res.render("./emails/recovery", {
    ...theme,
    username,
    code,
    site: `${site.protocol}//${site.host}`
  }, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    }
    else {
      console.log(email);
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
          subject: "Recover account for " + site.hostname,
          html: html
        }, (err) => {
          if (err) console.error(err);
          else res.status(201).end();
        });
    }
  });
};
const update = (res, email, username, theme, code, site) => {
  //const page = testing ? "https://liambloom.herokuapp.com" : `${site.protocol}//${site.host}`;
  console.log("mail ran");
  res.render("./emails/update", {
    ...theme,
    username,
    code,
    site: `${site.protocol}//${site.host}`
  }, (err, html) => {
    if (err) {
      console.error(err);
      res.status(500).end();
    }
    else {
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
        }, (err) => {
          if (err) console.error(err);
          else res.status(201).end();
        });
    }
  });
};

module.exports = {
  mail: {
    confirm,
    recover,
    update
  },
  initPool
};