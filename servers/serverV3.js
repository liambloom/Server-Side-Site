//jshint esversion:9
const { app, DB, requireLogin, port, adminOnly, testingOnly, mail, icons } = require("./init");
const serve = require("./servePage");

app.get("/api/users", adminOnly, DB.user.getAll);
app.get("/api/logout", DB.user.logout);
app.get("/api/confirm-email/:addId", DB.user.update.fromEmailConfirm);
app.get("/api/json/themes.json", serve.themes);
app.post("/api/users/create", DB.user.create);
app.post("/api/users/confirm", DB.user.confirm);
app.post("/api/sugestion", DB.sugestions.add);
app.put("/api/users", requireLogin, DB.user.update);

//put in the first, everything that needs permisions. The second ones that only need to be logged in, and the third admin only pages
app.get("/null", (req, res) => { res.redirect(404, "/"); });
app.get(/^(?!\/(?:api|null|test))/, serve);
//app.get(/\/(?:nothing)/, requireLogin, serve);
//app.get(/\/(?:nothing)/, adminOnly, serve);

app.listen(port, () => { 
  DB.createTable();
  icons();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});