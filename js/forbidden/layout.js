"use strict";
const hand = document.getElementById("hand");
const closeHand = e => {
  if (!hand.contains(e.target)) hand.classList.remove("open");
};
hand.addEventListener("click", e => {
  if (e.clientY - hand.getBoundingClientRect().y < window.innerHeight * 0.015) hand.classList.toggle("open");
  if (hand.classList.contains("open")) document.body.addEventListener("click", closeHand);
  else document.body.removeEventListener("click", closeHand);
});