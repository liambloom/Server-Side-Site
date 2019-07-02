const { app, DB, requireLogin, port, adminOnly, icons } = require("./init");
const serve = require("./servePage");

app.get("/api/logout", DB.user.logout);
app.get("/api/confirm-email/:addId", DB.user.update.fromEmailConfirm);
app.get("/api/json/themes.json", serve.themes);
app.get("/api/users/hasEmail", requireLogin, DB.user.hasEmail);
app.get("/api/recover", DB.user.recover.get);
app.post("/api/users/create", DB.user.create);
app.post("/api/users/confirm", DB.user.confirm);
app.post("/api/sugestion", DB.sugestions.add);
app.post("/api/recover", DB.user.recover.send);
app.put("/api/users", requireLogin, DB.user.update);
app.put("/api/recover", DB.user.update.fromPasswordRecovery);
app.delete("/api/email", requireLogin, DB.user.removeEmail);

app.get("/admin/users", adminOnly, DB.user.getAll);
app.get("/admin/sugestions", adminOnly, DB.sugestions.get);

app.get("/null", (req, res) => { res.redirect(404, "/"); });
app.get(/^(?!\/(?:api|null|test))/, serve);
//app.get(/\/(?:nothing)/, requireLogin, serve);
//app.get(/\/(?:nothing)/, adminOnly, serve);

app.listen(port, () => { 
  DB.createTable();
  icons();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});