"use strict";
import Player from "./player.js";
import Board from "./board.js";

window.board = new Board(window.board);
for (let player in window.players) {
  window.players[player].name = player;
  window.players[player] = new Player(window.players[player]);
}
window.player = window.players[window.player.name];