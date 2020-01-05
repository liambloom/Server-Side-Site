const serve = require("./servePage");
const fs = require("fs");
const url = require("url");

module.exports = {
  serve (req, res) {
    const game = req.params.game;//new URLSearchParams(url.parse(req.originalUrl).search).get("game");
    serve.custom(req, res, "./forbidden/index", {
      game,
      board: JSON.parse(fs.readFileSync(`./json/forbidden/${game}/board.json`)),
      player: JSON.parse(fs.readFileSync(`./json/forbidden/${game}/players.json`)).random()
    });
  }
};