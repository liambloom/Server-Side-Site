"use strict";
const { app, serve, DB, requireLogin, adminOnly, port, site, admin, api, countdown, count, aws } = require("./init");

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

countdown.get(/^\/(?!(?:test|custom))/, count.serve);
countdown.get("/custom", requireLogin, count.serve);
countdown.get("/test", adminOnly, count.serve);
countdown.post("/pieces/list", count.render.list);
countdown.post("/pieces/test", adminOnly, count.render.countdown);
countdown.post(/\/pieces\//.concat(UUID_REGEX), count.render.countdown);
countdown.post("/new", requireLogin, count.newCountdown);

site.get(/^(?!\/(?:secure|update|aws|flashcards))/, serve);
site.get("/secure", requireLogin, DB.user.secure);
site.get("/update/:category", requireLogin, serve.update);
site.get(/\/flashcards\//.concat(UUID_REGEX), serve.flashcards.view);
site.get(/^\/aws/, aws.getRequest);

app.listen(port, () => { if (testing) console.debug(`[Server] [${new Date().toString()}]: Server running on port ${port}.`); });