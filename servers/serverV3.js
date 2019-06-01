//jshint esversion:9
const { app, nodemailer, DB, requireLogin, port, adminOnly } = require("./init");
const serve = require("./servePage");

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

app.get("/api/users", adminOnly, DB.user.getAll);
//app.get("/api/users/:id", DB.user.get);
app.post("/api/users/create", DB.user.create);
app.post("/api/users/confirm", DB.user.confirm);
app.put("/api/users/theme", requireLogin, DB.user.update);
//app.put("api/users/:id", DB.user.update);
//app.delete("/api/users/:id", DB.user.delete);
app.get("/logout", DB.user.logout);

//put in the first, everything that needs permisions. The second ones that only need to be logged in, and the third admin only pages
app.get(/^(?!\/(?:nothing|json\/themes\.json))/, serve);
app.get("/json/themes.json", serve.themes);
app.get(/\/(?:nothing)/, requireLogin, serve);
app.get(/\/(?:nothing)/, adminOnly, serve);

app.listen(port, () => { 
  DB.createTable();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});