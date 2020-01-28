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
    console.log("foo");
    if (req.forbiddenKey && req.forbiddenKey.key) res.redirect(303, url.parse(req.originalUrl).query.u);
    else serve(req, res);
  }
};