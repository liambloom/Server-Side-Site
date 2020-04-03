// Everything breaks when window is resized

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const strokeWeight = 5;
let mousedown = false;
let prevX, prevY, prevX2, prevY2;

ctx.lineWidth = strokeWeight;

const pointAt = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, strokeWeight / 2, 0, 2 * Math.PI);
  ctx.fill();
};
const onmousedown = () => {
  mousedown = true;
  const bcr = canvas.getBoundingClientRect();
  const x = (event.clientX || event.changedTouches[0].clientX) - bcr.left - scrollX;
  const y = (event.clientY || event.changedTouches[0].clientY) - bcr.top - scrollY;
  pointAt(x, y);
  prevX2 = x;
  prevY2 = y;
  prevX = x;
  prevY = y;
};
const onmouseup = () => {
  if (mousedown) {
    mousedown = false;
    prevX = undefined;
    prevY = undefined;
  }
};
const onmousemove = event => {
  event.preventDefault();
  if (mousedown) {
    const bcr = canvas.getBoundingClientRect();
    const x = (event.clientX || event.changedTouches[0].clientX) - bcr.left - scrollX;
    const y = (event.clientY || event.changedTouches[0].clientY) - bcr.top - scrollY;
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();
    pointAt(x, y);
    prevX2 = prevX;
    prevY2 = prevY;
    prevX = x;
    prevY = y;
  }
};

canvas.addEventListener("mousedown", onmousedown);
canvas.addEventListener("touchstart", onmousedown);
document.addEventListener("mouseup", onmouseup);
document.addEventListener("touchend", onmouseup);
//document.addEventListener("touchcancel", onmouseup);
//document.addEventListener("blur", onmouseup);
document.addEventListener("mouseout", onmouseup);
canvas.addEventListener("mousemove", onmousemove);
canvas.addEventListener("touchmove", onmousemove);