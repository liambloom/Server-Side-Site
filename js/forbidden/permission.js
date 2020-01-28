"use strict"; // does not work on mobile
const cursor = document.getElementById("cursor");
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
    const bcr = digits[digit].getBoundingClientRect();
    if (digit === 32) cursor.style.setProperty("left", `calc(${bcr.left + bcr.width}px + 0.1em)`);
    else cursor.style.setProperty("left", `calc(${bcr.left}px - 0.1em)`);
  }
}
function dist (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
if (document.readyState === "complete") cursorToDigit(0);
else window.addEventListener("load", () => { cursorToDigit(0); });

document.addEventListener("keydown", event => {
  if (/^[0-9a-fA-F]$/.test(event.key)) {
    digits[currentDigit].innerHTML = event.key.toUpperCase();
    cursorToDigit(++currentDigit);
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
    }
  }
});
document.addEventListener("click", event => {
  const clickDist = (x, y) => dist(event.clientX, event.clientY, x, y);
  const distances = digits.map(e => {
    const bcr = e.getBoundingClientRect();
    return Math.min(clickDist(bcr.x, bcr.y));
  });
  console.log(distances.indexOf(Math.min(...distances)));
  cursorToDigit(distances.indexOf(Math.min(...distances)));
});