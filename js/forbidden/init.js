"use strict";
import Player, { User } from "./player.js";
import Board from "./board.js";
import Deck from "./deck.js";

Object.defineProperty(HTMLElement.prototype, "vibrate", {
  value: function (time = 2.5) {
    this.classList.add("vibrate");
    setTimeout(() => {
      this.classList.remove("vibrate");
    }, time * 1000);
  }
});
Object.defineProperty(SVGElement.prototype, "vibrate", {
  value: HTMLElement.prototype.vibrate
});

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
        setTimeout(async () => {
          await gameData.decks.treasure.draw(2);
          gameData.decks.flood.draw(gameData.flood.level);
        }, 500);
      }
    },
    infiniteTurns: false
  },
  decks: {
    flood: new Deck(window.floodDeck, {
      postAnimation: removed => new Promise(resolve => {
        board[removed].flood();
        setTimeout(resolve, 2500);
      }),
    }),
    treasure: new Deck(window.treasureDeck)
  },
  flood: {
    notch: window.difficulty,
    increase: function () {
      this.notch++;
      if (this.level === undefined) {
        // Game over
        this.cover();
      }
      else {
        this.cover();
      }
    },
    cover: function () {
      document.getElementById("background").vibrate();
      //document.getElementById("background-cover").style.height = `${window.innerHeight - window.innerHeight * this.notch / (window.floodLevels.length + 2)}px`; // 1 added because that's how dividing works, other is death
    },
    get level () {
      return window.floodLevels[this.notch];
    }
  }
};
gameData.flood.cover();
gameData.decks.flood.drawConcurrent(6);
if (testing) window.gameData.turns.order.unshift(window.gameData.turns.order.splice(window.gameData.turns.order.indexOf(window.player), 1)[0]);// Testing only