const directions = {
  up: 0,
  down: 1,
  left: 2,
  right: 3
};
const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
let length = 5;
let apple = Int8Array.of(15, 10);
let snake = [
  Int8Array.of(2, 10),
  Int8Array.of(3, 10),
  Int8Array.of(4, 10),
  Int8Array.of(5, 10),
  Int8Array.of(6, 10)
];
let size, pixelSize, gap, direction, nextDirection, loopId;
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
  console.log(event.key);
  if (/^Arrow(?:Right|Up|Down)$/.test(event.key) && direction === undefined) startGame();
});
function startGame () {
  frame();
  loopId = setInterval(frame, 75);
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
}
function gameOver () {
  console.log("game over");
  clearInterval(loopId);
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#808080";
  ctx.font = "40px 'Roboto Mono'";
  ctx.fillText("GAME OVER", (size - 180) / 2, size / 3 - 20);
  ctx.fillRect(3 * size / 8, 5 * size / 8, size / 4, size / 8);
  ctx.font = "16px 'Roboto Mono'";
  ctx.fillStyle = "black";
  ctx.fillText("RESTART", (size - 72) / 2, 3 * size / 4 - 8);
}

if (document.readyState === "complete") sizing();
else window.addEventListener("load", sizing);