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
    const bcr = digits[digit === 32 ? 31 : digit].getBoundingClientRect();
    cursor.style.setProperty("top", `${bcr.top}px`);
    if (digit === 32) cursor.style.setProperty("left", `calc(${bcr.left + bcr.width}px + 0.1em)`);
    else cursor.style.setProperty("left", `calc(${bcr.left}px - 0.1em)`);
  }
}
function position () {
  cursorToDigit(currentDigit || 0);
  const mainBcr = document.getElementsByTagName("main")[0].getBoundingClientRect();
  const instructions = document.getElementById("instructions");
  const alternate = document.getElementById("alternate");
  const error = document.getElementById("error");
  for (let e of [instructions, alternate, error]) {
    e.style.setProperty("width", `${mainBcr.width}px`);
  }
  instructions.style.setProperty("top", `calc(${mainBcr.top - scrollY - instructions.getBoundingClientRect().height}px - 1em)`);
  alternate.style.setProperty("top", `calc(${mainBcr.top - scrollY + mainBcr.height}px + 1em)`);
  const altBcr = alternate.getBoundingClientRect();
  error.style.setProperty("top", `calc(${altBcr.top + altBcr.height - scrollY}px + 1em)`);
}
if (document.readyState === "complete") position();
else window.addEventListener("load", position);
window.addEventListener("resize", position);
window.addEventListener("scroll", position);

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
});