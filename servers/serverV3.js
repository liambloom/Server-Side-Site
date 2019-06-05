//jshint esversion:9
const { app, nodemailer, DB, requireLogin, port, adminOnly } = require("./init");
const serve = require("./servePage");

app.get("/api/users", adminOnly, DB.user.getAll);
app.get("/api/logout", DB.user.logout);
app.get("/api/json/themes.json", serve.themes);
app.post("/api/users/create", DB.user.create);
app.post("/api/users/confirm", DB.user.confirm);
app.post("/api/sugestion", DB.sugestions.add);
app.put("/api/users/theme", requireLogin, DB.user.update);

//put in the first, everything that needs permisions. The second ones that only need to be logged in, and the third admin only pages
app.get(/^(?!\/(?:api))/, serve);
//app.get(/\/(?:nothing)/, requireLogin, serve);
//app.get(/\/(?:nothing)/, adminOnly, serve);

app.listen(port, () => { 
  DB.createTable();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});