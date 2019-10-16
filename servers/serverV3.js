"use strict";
const { app, DB, requireLogin, port, icons, site, admin, api } = require("./init");
const serve = require("./servePage");

api.get("/logout", DB.user.logout);
api.get("/confirm-email/:addId", DB.user.update.fromEmailConfirm);
api.get("/json/themes.json", serve.themes);
api.get("/users/email", requireLogin, DB.user.hasEmail);
api.post("/users/create", DB.user.create);
api.post("/users/confirm", DB.user.confirm);
api.post("/sugestion", DB.sugestions.add);
api.post("/recover", DB.user.recover.get);
api.post("/recover/:username", DB.user.recover.send);
api.put("/users", requireLogin, DB.user.update);
api.put("/recover", DB.user.update.fromPasswordRecovery);
api.delete("/email", requireLogin, DB.user.removeEmail);

admin.get(/^(?!\/(?:users|sugestions))/, serve);
admin.get("/users", DB.user.getAll);
admin.get("/sugestions", DB.sugestions.get);

site.get(/^(?!\/(?:secure|update))/, serve);
site.get("/secure", requireLogin, DB.user.secure);
site.get("/update/:category", requireLogin, serve.update);

app.listen(port, () => { 
  DB.createTable();
  icons();
  console.debug(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
});