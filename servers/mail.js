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
    }
  });
};
module.exports = {
  confirm
};