//jshint esversion:9
const express = require("express");
const nodemailer = require("nodemailer");
//const passport = require("passport");
const serve = require("./servePage");
const DB = require("./queries");

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(passport.initialize());
//app.use(passport.session());

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

app.get("/api/users", DB.getUsers);
app.get("/api/users/:id", DB.getUserById);
app.post("/api/users/create", DB.createUser);
app.post("/api/users/confirm", /*passport.authenticate("local"), */DB.confirmUser);
/*app.put("api/users/:user", (req, res) => {
  //edit user status 201
});*/
app.delete("/api/users/:id", DB.deleteUser);

//learn PostgreSQL
/*app.get("/DB/users", DB.getUsers);
app.get("/DB/users/:id", DB.getUserById);
app.post("/DB/users", DB.createUser); 
app.put("/DB/users/:id", DB.updateUser);
app.delete("/DB/users/:id", DB.deleteUser);*/

app.get(/^(?!\/api)/, serve);

app.listen(port, () => { 
  DB.createTable();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});