"use strict";
import Player, { User } from "./player.js";
import Board from "./board.js";

window.testing = new URLSearchParams(location.search).get("testing") === "true";
window.board = new Board(window.board);
for (let player in window.players) {
  window.players[player].name = player;
  window.players[player] = (player === window.player.name) ? new User(window.player) : new Player(window.players[player]);
}
window.player = window.players[window.player.name];
window.gameData = {
  turns: {
    actionsTaken: 0,
    order: window.order.map(player => window.players[player]),
    get current() {
      return this.order[0];
    },
    actionTaken: function () {
      if (++this.actionsTaken >= 3) {
        this.endTurn();
      }
    },
    endTurn: function () {
      if (testing && this.infiniteTurns) {
        console.log("turnOver");
      }
      else {
        this.actionsTaken = 0;
        this.order.push(this.order.shift());

      }
    },
    infiniteTurns: false
  },
  decks: {
    flood: window.floodDeck

  },
  flood: window.floodLevel
};
for (let i = 0; i < 6; i++) {
  board[gameData.decks.flood.shift()].flood();
}
if (testing) window.gameData.turns.order.unshift(window.gameData.turns.order.splice(window.gameData.turns.order.indexOf(window.player), 1)[0]);// Testing only