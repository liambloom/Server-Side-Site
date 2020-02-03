const serve = require("./servePage");
const fs = require("fs");
const url = require("url");

module.exports = {
  serve (req, res) {
    const game = req.params.game;//new URLSearchParams(url.parse(req.originalUrl).search).get("game");
    const players = JSON.parse(fs.readFileSync(`./json/forbidden/${game}/players.json`));
    const treasureData = JSON.parse(fs.readFileSync(`./json/forbidden/${game}/decks/treasure.json`));
    const floodData = JSON.parse(fs.readFileSync(`./json/forbidden/${game}/flood.json`));
    const treasures = [];
    const flood = [];
    let difficulty = ["novice", "normal", "elite", "legendary"].indexOf((url.parse(req.originalUrl, true).query.difficulty || "normal").toLowerCase());
    if (difficulty === -1) difficulty = 1;
    for (let player in players) {
      players[player].name = player;
    }
    for (let card in treasureData) {
      for (let i = 0; i < treasureData[card]; i++) {
        treasures.push(card);
      }
    }
    for (let level in floodData) {
      for (let i = 0; i < floodData[level]; i++) {
        flood.push(Number(level));
      }
    }
    serve.custom(req, res, "./forbidden/index", {
      game,
      board: JSON.parse(fs.readFileSync(`./json/forbidden/${game}/board.json`)),
      players,
      treasures: treasures.shuffle(),
      difficulty,
      flood
    });
  },
  permission (req, res) {
    let game = req.originalUrl.match(/(?<=[^\?]*\?[^\?]*u=.*\/)[^&\/#\?]*(?=[&\?#].*)?$/);
    game = game ? game[0].replace(/^(.)/, $1 => $1.toUpperCase()) : "Island";
    if (testing || req.forbiddenKey && req.forbiddenKey.key || req.user && req.user.forbidden_permission) res.redirect(303, req.originalUrl.match(/(?<=[^\?]*\?[^\?]*u=)[^&]*(?=&.*)?$/)[0]);
    else serve.custom(req, res, "./forbidden/permission", { game });
  }
};