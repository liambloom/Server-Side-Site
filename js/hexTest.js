let fpsCount;
let clearFps = () => {
  clearInterval(fpsCount);
  document.getElementById("fps").innerHTML = "";
};
let getFps = () => {
  document.getElementById("fps").innerHTML = Math.round(hex.fps()) + " fps";
};
document.getElementById("run").addEventListener("click", () => {
  if (!document.querySelector(":invalid")) {
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
  getFps();
  fpsCount = setInterval(getFps, 1000);
});
document.getElementById("stop").addEventListener("click", () => {
  hex.stop();
  clearFps();
});
document.getElementById("clear").addEventListener("click", () => {
  hex.stop();
  hex.clear();
  clearFps();
});
document.getElementById("dropdown").addEventListener("input", event => {
  if (event.target.value === "Forever") document.getElementById("degOrSec").style.display = "none";
  else document.getElementById("degOrSec").style.display = "initial";
});
document.getElementById("dropdown").dispatchEvent(new Event("input"));