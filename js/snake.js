const directions = {
  up: 0,
  down: 1,
  left: 2,
  right: 3
};
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const init = {
  length: 5,
  apple: Int8Array.of(15, 10),
  snake: [
    Int8Array.of(2, 10),
    Int8Array.of(3, 10),
    Int8Array.of(4, 10),
    Int8Array.of(5, 10),
    Int8Array.of(6, 10)
  ]
};
let { length, apple, snake } = Object.clone(init);
let size, pixelSize, gap, direction, nextDirection, loopId;
let touchdown = false;
const prev = [];
document.addEventListener("keydown", event => {
  switch (event.key) {
    case "ArrowLeft":
      if (direction !== directions.right) nextDirection = directions.left;
      break;
    case "ArrowRight":
      if (direction !== directions.left) nextDirection = directions.right;
      break;
    case "ArrowUp":
      if (direction !== directions.down) nextDirection = directions.up;
      break;
    case "ArrowDown":
      if (direction !== directions.up) nextDirection = directions.down;
      break;
  }
  if (/^Arrow(?:Right|Up|Down)$/.test(event.key) && direction === undefined) startGame();
});
document.addEventListener("touchstart", () => touchdown = true);
document.addEventListener("touchend", () => touchdown = false);
document.addEventListener("touchmove", event => {
  const x = event.changedTouches[0].clientX;
  const y = event.changedTouches[0].clientY;
  prev.splice(0, Math.max(0, prev.findIndex(e => e.time >=  performance.now() - 200)));
  if (prev.length) console.log(x, y, prev[0].x, prev[0].y);
  if (prev.length && prev[0].time >= performance.now() - 200) {
    const dx = Math.abs(x - prev[0].x);
    const dy = Math.abs(y - prev[0].y);
    console.log("Valid");
    if (dx > dy * 2) { // Horizontal change
      if (x < prev[0].x && direction !== directions.right) nextDirection = directions.left;
      else if (x > prev[0].x && direction !== directions.left) nextDirection = directions.right;
    }
    if (dy > dx * 2) { // vertical change
      if (y < prev[0].y && direction !== directions.down) nextDirection = directions.up;
      else if (y > prev[0].y && direction !== directions.up) nextDirection = directions.down; 
    }
    if (direction === undefined && (dx < 50 && dy > 200 || dy < 50 && dx > 200)) startGame();
  }
  prev.push({
    x, y, time: performance.now()
  });
});
function startGame () {
  frame();
  loopId = setInterval(frame, 100);
}
function frame () {
  const head = Int8Array.from(snake[snake.length - 1]);
  direction = nextDirection;
  console.log(direction);
  switch (direction) {
    case directions.right:
      head[0]++;
      break;
    case directions.left:
      head[0]--;
      break;
    case directions.down:
      head[1]++;
      break;
    case directions.up:
      head[1]--;
      break;
  }
  if (head[0] === apple[0] && head[1] === apple[1]) length += 3;
  if (length <= snake.length) snake.shift();
  //console.log(head[0] < 0, head[0] > 20, head[1] < 0, head[1] > 20, snake.some(e => e[0] === head[0] && e[1] === head[1]));
  if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20 || snake.some(e => e[0] === head[0] && e[1] === head[1])) {
    gameOver();
    return;
  }
  snake.push(head);
  while (snake.some(e => e[0] === apple[0] && e[1] === apple[1])) apple = Int8Array.of(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20));
  draw();
}
function draw () {
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "green";
  for (let pixel of snake) {
    ctx.fillRect(gap + (pixelSize + gap) * pixel[0], gap + (pixelSize + gap) * pixel[1], pixelSize, pixelSize);
  }
  ctx.fillStyle = "red";
  ctx.fillRect(gap + (pixelSize + gap) * apple[0], gap + (pixelSize + gap) * apple[1], pixelSize, pixelSize);
}
function sizing () {
  size = Math.min(window.innerWidth, document.getElementsByTagName("main")[0].clientHeight, 442);
  pixelSize = size / 22.1;
  gap = size / 221;
  canvas.width = size;
  canvas.height = size;
  draw();
  canvas.focus();
  Promise.all(
    document.fonts.load("40px 'Roboto Mono'", "GAME OVER"),
    document.fonts.load("16px 'Roboto Mono'", "RESTART")
  );
}
function gameOver () {
  console.log("game over");
  clearInterval(loopId);
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#808080";
  ctx.font = "40px 'Roboto Mono'";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", size / 2, size / 3);
  ctx.fillRect(3 * size / 8, 29 * size / 48, size / 4, size / 8);
  ctx.font = "16px 'Roboto Mono'";
  ctx.fillStyle = "black";
  ctx.fillText("RESTART", size / 2, 2 * size / 3);
  if (touchdown) document.addEventListener("touchend", addRestartListener, { once: true });
  else addRestartListener();   
}
function addRestartListener () {
  canvas.addEventListener("click", restart);
  canvas.addEventListener("touchstart", restart);
}
const restart = event => {
  const bcr = canvas.getBoundingClientRect();
  const x = ((event.clientX || event.changedTouches[0].clientX) - bcr.left);
  const y = ((event.clientY || event.changedTouches[0].clientY) - bcr.top);
  if (x >= 3 * size / 8 && x <= 5 * size / 8 && y >= 29 * size / 48 && y <= 35 * size / 48) {
    ctx.clearRect(0, 0, size, size);
    ({ length, apple, snake } = Object.clone(init));
    direction = undefined;
    draw();
    canvas.removeEventListener("click", restart);
    canvas.removeEventListener("touchstart", restart);
  }
};

if (document.readyState === "complete") sizing();
else window.addEventListener("load", sizing);