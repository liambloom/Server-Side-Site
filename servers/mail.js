//jshint esversion:9
const nodemailer = require("nodemailer");
const confirm = (email, username, theme, code) => {
  res.render("./confirmEmail", {
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
      pass: process.env.EMAIL_PASS
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
};
module.exports = {
  confirm
};