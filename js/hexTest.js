import Shape from "/js/shapes.js";
window.Shape = Shape;
Shape.test = (increment, start, config, axis) => {
  if (!increment) increment = 1;
  if (!start) start = 3;
  if (!config) config = {};
  if (!axis) axis = [0, 0, 0];
  let shape = [];
  for (let i = start; i <= 30; i = i + increment) {
    setTimeout(() => {
      document.onclick = undefined;
      if (shape[i - increment]) shape[i - increment].clear();
      shape[i] = new Shape(i, config);
      shape[i].draw(...axis);
      document.onclick = () => { console.debug(i); };
    }, 1000 * (i - start));
  }
}
let getFps = () => {
  document.getElementById("fps").innerHTML = (typeof hex.fps === "number") ? Math.round(hex.fps) + " fps" : "";
};
document.getElementById("run").addEventListener("click", () => {
  if (!document.querySelector(':invalid:not([style="display: none;"])')) {
    hex.size = parseInt(document.getElementById("radius").value);
    let rpm = parseInt(document.getElementById("rpm").value);
    let deg;
    switch (document.getElementById("dropdown").value) {
      case "Degrees":
        deg = parseInt(document.getElementById("degOrSec").value);
        break;
      case "Seconds":
        deg = parseInt(document.getElementById("degOrSec").value) * rpm * 6;
        break;
      case "Forever":
        deg = Infinity;
        break;
    }
    hex.spin(rpm, deg);
  }
  /*getFps();
  fpsCount = setInterval(getFps, 1000);*/
  document.getElementById("hex").addEventListener("fpsUpdate", getFps);
});
document.getElementById("stop").addEventListener("click", () => {
  hex.stop();
  //clearFps();
});
document.getElementById("clear").addEventListener("click", () => {
  hex.stop();
  hex.clear();
  //clearFps();
});
document.getElementById("dropdown").addEventListener("input", event => {
  if (event.target.value === "Forever") document.getElementById("degOrSec").style.display = "none";
  else document.getElementById("degOrSec").style.display = "initial";
});
document.getElementById("dropdown").dispatchEvent(new Event("input"));