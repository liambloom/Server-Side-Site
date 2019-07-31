window.hex = () => {
  fpsMonitor();
  let c = document.getElementById("hex"); // Get canvas element
  c.height = 300; // Set height
  c.width = 300; // Set width
  let ctx = c.getContext('2d'); // Get canvas object
  hex.size = 100; // radius at points
  let x = 150; // center x
  let y = 150; // center y
  let fpsArr;
  let framerate = fps || 60;

  hex.draw = i => {
    hex.clear(); // remove previous frame
    ctx.beginPath(); // begin a new shape
    ctx.moveTo(x + hex.size * Math.cos(0), y + hex.size * Math.sin(0));// start at (x+hex.size, 0), or rightmost point, because cos(0)=1 and sin(0)=0

    for (let side = 0; side <= 6; side++) { // For 6 sides
      ctx.lineTo(x + (hex.size - i) * Math.cos(side * 2 * Math.PI / 6), y + hex.size * Math.sin(side * 2 * Math.PI / 6)); // if i is one, the hexagon is normal. As i aproaches hex.size, the width shrinks linearly
      //when i===0, the hexagon will be full hex.size. When i===hex.size, the hexagon will disapear
    }
    
    ctx.fillStyle = themes[theme.color].gradientLight;//"#333333"; // Grey
    ctx.fill(); // Fill up the hexagon
    return 2 * (hex.size - i); // return hexagon width
  };

  hex.spin = (rpm, until) => { // How did I figure this out? I typed random numbers into desmos until they did what I wanted.
    hex.stop(); // Stop current spinning

    if (typeof rpm !== "number" || Math.abs(rpm) === Infinity) throw rpm + " is not a valid rpm";
    if (typeof until !== "number") until = Infinity;
    let i = 0;
    let dif = 1;
    let speed = (framerate * 60 * dif) / (2 * Math.PI * rpm);
    let iMax = (Math.PI * speed * until) / 180;
    fpsArr = [1]; // The first thing pushed is framerate / framerate
    let start, b4Decrease;

    hex.count = setInterval(() => {
      hex.draw(Math.cos(i / speed) * hex.size + hex.size); // Make it bigger and smaller
      i = i + dif; // Increment i
      if (i >= iMax - (0.25 * Math.PI * speed) && start) { // If ecceds is 45 degrees from done
        if (!b4Decrease) { b4Decrease = fpsArr.reduce((a, b) => a + b) / fpsArr.length; } //dif; // b4Decrease = dif before slowing down spin
        dif = hex.framerate(framerate, start, fpsArr) * ((Math.acos(((i - iMax) / (0.25 * Math.PI * speed)) + 1) * 1.9 * b4Decrease) / Math.PI); // Decrease dif **1.9 should be a 2, but it looked wrong**
        if (isNaN(dif)) { // If (i > iMax) <-- This is the same thing
          dif = 0; // Stop spinning
          clearInterval(hex.count); // Stop looping
          if (until % 90 === 0 && until % 180 !== 0) hex.clear(); // If the hexagon ended as a sliver, get rid of it
        }
      }
      else if (start) {
        dif = hex.framerate(framerate, start, fpsArr);//framerate / (1 / ((new Date() - start) / 1000)); // Change dif to account for lag
      }

      start = new Date(); // start timer to detect fps
    }, 1000 / framerate); // 75 fps
  };

  hex.framerate = (framerate, start, fpsArr) => {
    let rate = framerate / (1 / ((new Date() - start) / 1000));
    fpsArr.push(rate);
    if (fpsArr.length > 10) fpsArr.shift();
    return rate;
  };
  
  hex.fps = () => {
    return 1 / (fpsArr.slice(-1)[0] / framerate);
  };

  hex.stop = () => {
    clearInterval(hex.count);
  };

  hex.clear = () => {
    ctx.clearRect(0, 0, c.width, c.height);
  };
};

if (window.themeReady) hex();
else window.addEventListener("themeReady", hex);