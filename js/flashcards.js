modal.open("#instructions");
Object.defineProperty(window, "frontCard", {
  get: function () {
    return document.getElementsByClassName("card-container")[0];
  }
});
function flip () {
  frontCard.classList.toggle("flip");
}
function toBack () {
  //if (Boolean.random()) flip();
  frontCard.classList.remove("flip");
  document.getElementsByTagName("main")[0].appendChild(frontCard);
}
for (let e of document.getElementsByClassName("card")) {
  e.addEventListener("click", flip);
}
document.addEventListener("keypress", event => {
  console.log(event.keyCode);
  switch (event.keyCode) {
    case 13: // enter
      frontCard.remove();
      break;
    case 32:  //space
      flip();
      break;
    case 48: // zero (bc backspace didn't work and it's comfortable on the keyboard)
      toBack();
      break;
  }
});