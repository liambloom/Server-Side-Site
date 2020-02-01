const serve = require("./servePage");
const fs = require("fs");
const url = require("url");

module.exports = {
  serve (req, res) {
    const game = req.params.game;//new URLSearchParams(url.parse(req.originalUrl).search).get("game");
    const players = JSON.parse(fs.readFileSync(`./json/forbidden/${game}/players.json`));
    for (let player in players) {
      players[player].name = player;
    }
    serve.custom(req, res, "./forbidden/index", {
      game,
      board: JSON.parse(fs.readFileSync(`./json/forbidden/${game}/board.json`)),
      players: players
    });
  },
  permission (req, res) {
    let game = req.originalUrl.match(/(?<=[^\?]*\?[^\?]*u=.*\/)[^&\/#\?]*(?=[&\?#].*)?$/);
    game = game ? game[0].replace(/^(.)/, $1 => $1.toUpperCase()) : "Island";
    if (testing || req.forbiddenKey && req.forbiddenKey.key || req.user && req.user.forbidden_permission) res.redirect(303, req.originalUrl.match(/(?<=[^\?]*\?[^\?]*u=)[^&]*(?=&.*)?$/)[0]);
    else serve.custom(req, res, "./forbidden/permission", { game });
  }
};