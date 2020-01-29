"use strict"; // does not work on mobile
const cursor = document.getElementById("cursor");
const input = document.getElementById("input");
const digits = [];
let currentDigit;
for (let e of document.getElementsByClassName("character")) {
  digits.push(e);
}
setInterval(() => {
  cursor.classList.toggle("hide");
}, 500);
function cursorToDigit (digit) {
  if (digit < 0) return ++currentDigit;
  else if (digit > 32) return --currentDigit;
  else {
    currentDigit = digit;
    const bcr = digits[digit === 32 ? 31 : digit].getBoundingClientRect();
    let left;
    cursor.style.setProperty("top", `${bcr.top}px`);
    input.style.setProperty("top", `${bcr.top + bcr.height / 2}px`);
    if (digit === 32) left = `calc(${bcr.left + bcr.width}px + 0.1em)`;
    else left = `calc(${bcr.left}px - 0.1em)`;
    cursor.style.setProperty("left", left);
    input.style.setProperty("left", left);
  }
}
if (document.readyState === "complete") cursorToDigit(0);
else window.addEventListener("load", () => { cursorToDigit(0); });
window.addEventListener("resize", () => {
  if (currentDigit !== undefined) cursorToDigit(currentDigit);
});

function verify () {
  
}
document.addEventListener("keydown", event => {
  if (/^[0-9a-fA-F]$/.test(event.key)) {
    if (!(currentDigit >= 32 || currentDigit < 0)) {
      digits[currentDigit].innerHTML = event.key.toUpperCase();
      cursorToDigit(++currentDigit);
    }
  }
  else {
    switch (event.keyCode) {
      case 37: // left
        cursorToDigit(--currentDigit);
        break;
      case 39: // right
        cursorToDigit(++currentDigit);
        break;
      case 38: // up
        cursorToDigit(0);
        break;
      case 40: // down
        cursorToDigit(31);
        break;
      case 8: // backspace
        event.preventDefault();
        cursorToDigit(--currentDigit);
        digits[currentDigit].innerHTML = "#";
        break;
      case 46: // delete
        digits[currentDigit].innerHTML = "#";
        break;
      case 13: // enter
        verify();
    }
  }
});
document.addEventListener("click", event => {
  const distances = digits.map(e => {
    const bcr = e.getBoundingClientRect();
    return Math.sqrt(Math.pow(event.clientX - (bcr.x - 2.4), 2) + Math.pow(event.clientY - (bcr.y + bcr.height / 2), 2));
  });
  cursorToDigit(distances.indexOf(Math.min(...distances)));
  input.focus();
});