//jshint esversion:9
const nodemailer = require("nodemailer");
const fs = require("fs");
const uuid = require("uuid/v4");
const { convert } = require("convert-svg-to-png"); // Will heroku be able to handle the fact that this module also needs to download chromium?
const url = require("url");
//const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const confirm = (res, email, username, theme, code, site) => {
  res.render("../img/favicon/main/favicon_vector.ejs", theme, (err, svg) => {
    convert(svg, {height: 50, width: 50})
      .then(png => {
        console.log(png);
        res.render("./confirmEmail", {
          ...theme,
          username,
          code,
          site: `${site.protocol}//${site.host}`,
          logo: png
        }, (err, html) => {
          if (err) {
            console.error(err);
            res.status(500).end(err);
          }
          else {
            nodemailer.createTransport({
              /*host: "smtp.gmail.com",
              port: 465,*/
              service: "gmail",
              auth: {
                //type: "login",
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
      });
  });
};
confirm.test = (req, res) => {
  fs.readFile("./json/themes.json", (err, data) => {
    if (err) res.status(500).end(err);
    else {
      //newUser(req, res, id, username, password, null, color, light);
      fs.readFile("./json/themes.json", (err, data) => {
        if (err) res.status(500).end(err);
        else {
          //console.log(JSON.parse(data));
          //console.log(req.user.color);
          const theme = JSON.parse(data)[req.user.color];
          const newTheme = {
            light: theme.gradientLight,
            dark: theme.gradientDark,
            headTxt: theme.headTextColor
          };
          if (req.user.light === "dark") {
            newTheme.bg = theme.offBlack;
            newTheme.txt = theme.headTextColor;
          }
          else {
            newTheme.bg = theme.offWhite;
            newTheme.txt = theme.offBlack;
          }
          //console.log(`${path(req).protocol}//${path(req).host}`);
          res.render("./confirmEmail", {
            ...newTheme,
            username: req.user.username,
            code: uuid(),
            site: `${path(req).protocol}//${path(req).host}`
          }, (err, html) => {
            if (err) {
              console.error(err);
              res.status(500).end(err);
            }
            else {
              res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
              res.write(html);
              res.end();
            }
          });
        }
      });
    }
  });
};
module.exports = {
  confirm
};