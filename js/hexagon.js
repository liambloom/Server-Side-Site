window.hex = () => {
  let c = document.getElementById("canvas"); // Get canvas element
  c.height = 300; // Set height
  c.width = 300; // Set width
  let ctx = c.getContext('2d'); // Get canvas object
  let size = 100; // radius at points
  let x = 100; // center x
  let y = 100; // center y
  let count;
  fpsMonitor();

  hex.draw = i => {
    ctx.clearRect(0, 0, c.width, c.height); // remove previous frame
    ctx.beginPath(); // begin a new shape
    ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));// start at (x+size, 0), or rightmost point, because cos(0)=1 and sin(0)=0

    for (let side = 0; side <= 6; side++) { // For 6 sides
      ctx.lineTo(x + (size - i) * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6)); // if i is one, the hexagon is normal. As i aproaches size, the width shrinks linearly
      //when i===0, the hexagon will be full size. When i===size, the hexagon will disapear
    }
    
    ctx.fillStyle = themes[theme.color].gradientLight;//"#333333"; // Grey
    ctx.fill(); // Fill up the hexagon
    return 2 * (size - i); // return hexagon width
  };

  hex.spin = (rpm, until) => { // How did I figure this out? I typed random numbers into desmos until they did what I wanted.
    if (typeof rpm !== "number" || Math.abs(rpm) === Infinity) throw rpm + " is not a valid rpm";
    if (typeof until !== "number") until = Infinity;
    let i = 0;
    let iMax = (2 * Math.PI * until) / 9; // Translate from degrees to input for draw funciton
    if (iMax < 0.5) throw "Cannot spin less than 0.8 degrees";
    let difInit = (iMax === Infinity) ? 1 : iMax / Math.round(iMax);
    let dif = difInit; // So that i is invremented by a factor of iMax
    let framerate = fps;
    let speed = (framerate * 60 * dif) / (2 * Math.PI * rpm);
    let start;
    console.log(framerate);
    count = setInterval(() => {
      hex.draw(Math.cos(i / speed) * size + size); // Make it bigger and smaller
      i = i + dif; // Increment i
      if (dif === 0) { // If done incrementing
        clearInterval(count); // Stop looping
        if (until % 90 === 0 && until % 180 !== 0) ctx.clearRect(0, 0, width, height); // If the hexagon ended as a sliver, get rid of it
      }
      if (Math.round(i) >= Math.round(iMax - (10 * Math.PI))) { // If ecceds is 45 degrees from done
        dif = (Math.acos((i - (iMax - (10 * Math.PI))) / (10 * Math.PI))) * (2  * difInit / Math.PI);
        if (isNaN(dif)) { // If (i > iMax) <-- This is the same thing
          dif = 0; // Stop spinning
        }
      }
      else if (start) {
        //console.log("start");
        //speed = ((1 / ((new Date() - start) / 1000)) * 60 * dif) / (2 * Math.PI * rpm);
        //start = new Date()
        //console.log(speed);
        dif = difInit * (framerate / (1 / ((new Date() - start) / 1000)));//(1 / ((1 / ((new Date() - start) / 1000)) / framerate));
        //console.log((1 / ((new Date() - start) / 1000)), framerate);
      }
      start = new Date();
    }, 1000 / framerate); // 75 fps
    return count;
  };

  hex.stop = () => {
    clearInterval(count);
  };
};

if (window.themeReady) hex();
else window.addEventListener("themeReady", hex);