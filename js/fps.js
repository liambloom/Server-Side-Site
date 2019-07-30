const times = [];
window.fps = undefined;

let fpsMonitor = () => {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    fpsMonitor();
  });
};
/*fpsMonitor();
export { fpsMonitor };*/