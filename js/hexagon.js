let c = document.getElementById("canvas"); // Get canvas element
c.height = height = 300; // Set height
c.width = width = 300; // Set width
let ctx = c.getContext('2d'); // Get canvas object
let size = 100; // radius at points
let x = 100; // center x
let y = 100; // center y

let draw = i => {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath(); // begin a new shape
  ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));// start at (x+size, 0), or rightmost point, because cos(0)=1 and sin(0)=0
  ctx.strokeStyle = "#00ffff";
  ctx.strokeWidth = 8;

  for (let side = 0; side <= 6; side++) { // For 6 sides
    ctx.lineTo(x + (size - i) * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6)); // if something is one, the hexagon is normal. As something aproaches infinity, the width shrinks exponentially
    //when i=0, the hexagon will be full size. When i=PI/2, the hexagon will disapear
  }
  
  ctx.fillStyle = "#333333"; // Grey
  ctx.fill(); // Fill up the hexagon
  return 2 * (size - i);
};

let spin = until => { // How did I figure this out? I typed random numbers into desmos until they did what I wanted.
  if (typeof until !== "number") {
    until = Infinity;
    dif = 1;
  }
  //console.log(until);
  i = 0;
  iMax = (2 * Math.PI * until) / 9;
  dif = iMax / Math.round(iMax);
  count = setInterval(() => {
    draw(Math.cos(i / 40) * size + size);
    //i = i + dif;
    i++;
    if (dif === 0) {
      clearInterval(count);
      ctx.clearRect(0, 0, width, height);
      //console.log(i, iMax);
    }
    if (Math.round(i) >= Math.round(iMax - (10 * Math.PI))) { // If ecceds is 45 degrees from done
      //console.log((Math.acos((i - (iMax - (10 * Math.PI))) / (10 * Math.PI))) * (2 * (iMax / Math.round(iMax)) / Math.PI));
      dif = (Math.acos((i - (iMax - (10 * Math.PI))) / (10 * Math.PI))) * (2 /* * (iMax / Math.round(iMax)) */ / Math.PI);
      if (isNaN(dif)) {
        dif = 0;
      }
      //console.log(dif);
    }
  }, 1000 / 75);
};