import "/js/switch.js";

window.canvas = document.getElementById("canvas");
window.ctx = canvas.getContext("2d");
window.strokeWeight = 5;
window.showSegments = document.getElementById("showSegments");
window.showPoints = document.getElementById("showPoints");
window.showBox = document.getElementById("showBox");
window.clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
window.search = new URLSearchParams(location.search);