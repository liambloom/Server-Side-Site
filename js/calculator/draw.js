let mousedown = false;
let timerExpired = true;
let prevLines = 0;
let prevX, prevY, timerId;
const lines = [];

const pointAt = (x, y, weight = strokeWeight) => {
  ctx.beginPath();
  ctx.arc(x, y, weight / 2, 0, 2 * Math.PI);
  ctx.fill();
};
const resetTimer = () => {
  if (timerId !== undefined) clearTimeout(timerId);
  timerExpired = false;
  timerId = setTimeout(() => {
    timerExpired = true;
    if (!mousedown) onTimerExpired();
  }, 500);
};
const onTimerExpired = () => {
  if (document.getElementById("showBox").value) {
    drawBoxes();
  }
};
const drawBoxes = force => {
  if (force || prevLines < lines.length) {
    prevLines = lines.length;
    clear();
    redrawLines();
    let boxes = [];
    for (let path of lines) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = 0;
      let maxY = 0;
      for (let node of path) {
        minX = Math.min(minX, node[0]);
        minY = Math.min(minY, node[1]);
        maxX = Math.max(maxX, node[0]);
        maxY = Math.max(maxY, node[1]);
      }
      boxes.push(Int32Array.of(minX - strokeWeight / 2, minY - strokeWeight / 2, maxX - minX + strokeWeight, maxY - minY + strokeWeight));
    }
    let changed = false;
    if (search.get("mergeObjects") !== "false") {
      do {
        changed = false;
        let boxesNew = [];
        while (boxes.length) {
          let box = boxes.shift();
          for (let box2 of boxes) {
            box2CenterPoint = box2[1] + box2[3] / 2;
            if (/*box[1] < box2CenterPoint && box2CenterPoint < box[1] + box[3]) { //*/!(box[0] > box2[0] + box2[2] || box[0] + box[2] < box2[0] || box[1] > box2[1] + box2[3] || box[1] + box[3] < box2[1])) {
              box = [
                Math.min(box[0], box2[0]),
                Math.min(box[1], box2[1]),
                Math.max(box[0] + box[2], box2[0] + box2[2]) - Math.min(box[0], box2[0]),
                Math.max(box[1] + box[3], box2[1] + box2[3]) - Math.min(box[1], box2[1])
              ];
              boxes.splice(boxes.indexOf(box2), 1);
              changed = true;
            }
          }
          boxesNew.push(box);
        }
        boxes = boxesNew;
      }
      while (changed);
    }
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.lineWidth = 2;
    for (let box of boxes) {
      const x = box[0] + box[2] / 2;
      const y = box[1] + box[3] / 2;
      /*const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      ctx.strokeStyle = color;
      ctx.fillStyle = color;*/
      ctx.strokeRect(...box);
      /*ctx.beginPath();
      ctx.moveTo(box[0], 0);
      ctx.lineTo(box[0], canvas.height);
      ctx.moveTo(box[0] + box[2], 0);
      ctx.lineTo(box[0] + box[2], canvas.height);
      ctx.moveTo(0, box[1]);
      ctx.lineTo(canvas.width, box[1]);
      ctx.moveTo(0, box[1] + box[3]);
      ctx.lineTo(canvas.width, box[1] + box[3]);
      ctx.stroke();*/
      pointAt(x, y);
      /*ctx.beginPath();
      ctx.arc(x, y, Math.min(box[2], box[3]) / 2, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, Math.max(box[2], box[3]) / 2, 0, 2 * Math.PI);
      ctx.stroke();*/
      ctx.beginPath();
      ctx.arc(x, y, Math.sqrt(box[2] ** 2 + box[3] ** 2) / 2, 0, 2 * Math.PI);
      ctx.stroke();
      /*ctx.beginPath();
      console.log(parseFloat(document.getElementById("multiplier").value), parseFloat(document.getElementById("baserad").value), Math.sqrt(box[2] ** 2 + box[3] ** 2), parseFloat(document.getElementById("yint").value));
      ctx.arc(x, y, (parseFloat(document.getElementById("multiplier").value) * parseFloat(document.getElementById("baserad").value) ** Math.sqrt(box[2] ** 2 + box[3] ** 2) + parseFloat(document.getElementById("yint").value)) / 2, 0, 2 * Math.PI);
      ctx.stroke();*/
    }
    ctx.restore();
  }
};
const redrawLines = () => {
  for (let path of lines) {
    pointAt(path[0][0], path[0][1]);
    for (let node in path) {
      node = parseInt(node);
      if (node === path.length - 1) break;
      if (document.getElementById("showSegments").value) {
        const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
      }
      ctx.beginPath();
      ctx.moveTo(path[node][0], path[node][1]);
      ctx.lineTo(path[node + 1][0], path[node + 1][1]);
      ctx.stroke();
      pointAt(path[node + 1][0], path[node + 1][1]);
    }
  }
};
showSegments.addEventListener("click", () => {
  if (!showSegments.value) {
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
  }
  if (showBox.value) drawBoxes(true);
  else {
    clear();
    redrawLines();
  }
});
showPoints.addEventListener("click", () => {
  ctx.lineWidth = showPoints.value ? 1 : strokeWeight;
  if (showBox.value) drawBoxes(true);
  else {
    clear();
    redrawLines();
  }
});
showBox.addEventListener("click", () => {
  if (showBox.value) drawBoxes(true);
  else {
    clear();
    redrawLines();
  }
});

const onmousedown = event => {
  if (event.type !== "mousedown" || !event.button) {
    mousedown = true;
    const bcr = canvas.getBoundingClientRect();
    const x = (event.clientX || event.changedTouches[0].clientX) - bcr.left - scrollX;
    const y = (event.clientY || event.changedTouches[0].clientY) - bcr.top - scrollY;
    pointAt(x, y);
    prevX = x;
    prevY = y;
    resetTimer();
    lines.push([Int32Array.of(x, y)]);
  }
};
const onmouseup = event => {
  if (event.type !== "mouseup" || !event.button) {
    mousedown = false;
    prevX = undefined;
    prevY = undefined;
    if (timerExpired) onTimerExpired();
  }
};
const onmousemove = event => {
  event.preventDefault();
  if (mousedown && (event.type !== "mousemove" || !event.button)) {
    const bcr = canvas.getBoundingClientRect();
    const x = (event.clientX || event.changedTouches[0].clientX) - bcr.left - scrollX;
    const y = (event.clientY || event.changedTouches[0].clientY) - bcr.top - scrollY;
    if (document.getElementById("showSegments").value) {
      const color = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();
    pointAt(x, y);
    prevX = x;
    prevY = y;
    resetTimer();
    lines.last().push(Int32Array.of(x, y));
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

document.getElementById("clear").addEventListener("click", () => {
  clear();
  lines.length = 0;
  timerExpired = true;
  clearTimeout(timerId);
  prevLines = 0;
});