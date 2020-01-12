"use strict";
document.documentElement.style.setProperty("--playerPrimary", player.color.main);
document.documentElement.style.setProperty("--playerSecondary", player.color.explanation);
document.documentElement.style.setProperty("--playerColor", player.color.piece);
const hand = document.getElementById("hand");
function closeHand (event) {
  if (!hand.contains(event.target)) {
    hand.classList.remove("open");
    document.body.removeEventListener("click", closeHand);
  }
}
hand.addEventListener("click", event => {
  const clickPos = event.clientY - hand.getBoundingClientRect().y;
  if (clickPos < window.innerHeight * 0.015 && clickPos > 0) hand.classList.toggle("open");
  if (hand.classList.contains("open")) document.body.addEventListener("click", closeHand);
  else document.body.removeEventListener("click", closeHand);
});

function shrinkCard (e) {
  e.style.setProperty("transform", "");
  e.removeEventListener("click", shrinkCard);
  e.classList.remove("expand");
}
function expandCard (e) {
  if (!e.classList.contains("expand")) {
    let s;
    const bcr = e.getBoundingClientRect();
    e.classList.add("expand");
    if (window.innerWidth / window.innerHeight > bcr.width / bcr.height) s = window.innerHeight * 0.96 / bcr.height;
    else s = window.innerWidth * 0.96 / bcr.width;
    e.style.setProperty("transform", `scale(${s}) translate(${((window.innerWidth - bcr.width * s) / 2 - bcr.x) / s}px, ${((window.innerHeight - bcr.height * s) / 2 - bcr.y) / s}px)`);
    document.body.addEventListener("click", event => {
      if (!e.contains(event.target)) shrinkCard(e);
    });
  }
  else shrinkCard(e);
}
for (let e of document.getElementsByClassName("card")) {
  e.addEventListener("click", () => expandCard(e));
}
const playerCard = document.getElementById("player");
playerCard.addEventListener("click", () => expandCard(playerCard));