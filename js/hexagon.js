import fps from "/js/fps.js";
window.hex = () => {
  let c = document.getElementById("hex"); // Get canvas element
  c.height = 300; // Set height
  c.width = 300; // Set width
  let ctx = c.getContext('2d'); // Get canvas object
  hex.size = 100; // radius at points
  let x = 150; // center x
  let y = 150; // center y
  let fpsArr = [1]; // The first thing pushed is framerate / framerate
  let fpsL = [1];
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
    fpsL.push(rate);
    return rate;
  };
  
  hex.fps = framerate;

  hex.stop = () => {
    clearInterval(hex.count);
  };

  hex.clear = () => {
    ctx.clearRect(0, 0, c.width, c.height);
  };

  setInterval(() => {
    if (fpsL.length) {
      hex.fps = fpsL.length;//1 / ((fpsL.reduce((a, b) => a + b) / fpsL.length) / framerate);
      fpsL = [];
    }
    else hex.fps = null;
    c.dispatchEvent(new Event("fpsUpdate"));
  }, 1000);
};

if (window.themeReady) hex();
else window.addEventListener("themeReady", hex);

//Private methods here
let verify = (value, fallback) => (typeof value === typeof fallback) ? value : fallback;

function shape(x, y, z, add) {
  this.ctx.beginPath();
  this.ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
  if (this.sides % 4 === 0) z += 180 / this.sides;
  else if (this.sides % 2 !== 0) z += 90;
  for (let side = 0; side <= this.sides; side++) {
    let a = side * 2 * Math.PI / this.sides + (this.sides - 2) * Math.PI * z / (this.angle * this.sides);
    this.ctx.lineTo(this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(a), this.y + (this.radius - add - (Math.cos(x * Math.PI / 180) + 1) * this.radius) * Math.sin(a));
  }
}

class Shape {
  constructor(sides, config) {
    //if (typeof config !== "object") config = {};
    config = verify(config, {});
    this.c = verify(config.canvas, document.getElementsByTagName("canvas")[0]);
    this.ctx = this.c.getContext('2d');
    this.sides = verify(sides, 4);
    this.angle = 180 - 360 / this.sides;
    this.fpsArr = [1];
    this.framerate = fps || 60;
    this.rotations = [];
    this.loop = -1;
    this.shape = (...params) => shape.apply(this, params);
    Object.defineProperties(this, {
      show: {
        get: function() {
          return this.rotations.length === 3;
        }
      },
      x: {
        configurable: true,
        set: function(value) {
          if (this.show)  this.clear(true);
          Object.defineProperty(this, "x", {
            get: function() {
              return value;
            }
          });
          if (this.show) this.draw(...this.rotations);
        }
      },
      y: {
        configurable: true,
        set: function (value) {
          if (this.show) this.clear(true);
          Object.defineProperty(this, "y", {
            get: function () {
              return value;
            }
          });
          if (this.show) this.draw(...this.rotations);
        }
      },
      color: {
        configurable: true,
        set: function (value) {
          if (this.show) this.clear(true);
          Object.defineProperty(this, "color", {
            get: function () {
              return value;
            }
          });
          if (this.show) this.draw(...this.rotations);
        }
      },
      width: {
        configurable: true,
        set: function (value) {
          if (this.show) this.clear(true);
          Object.defineProperty(this, "width", {
            get: function () {
              return value;
            }
          });
          
          if (sides % 4 === 0) this.radius = (value / 2) / Math.sin(Math.PI * this.angle / 360); // cos works too
          else if (sides % 2 === 0) this.radius = value / 2;
          //else this.radius = value / (Math.sin(this.angle * Math.PI / 360) + 1);//(value / Math.sin(/*Math.round(this.sides / 4) * 4*/((this.sides - 1) / 2) * 2 * Math.PI / this.sides)) * (180 - /*Math.round(this.sides / 4)*/((this.sides - 1) / 2) * 360 / this.sides) / 2;
          //console.log(this.radius);
          //console.log(this.angle);
          //else this.radius = //nothing
          //this.height = this.radius * Math.sqrt(3);
          if (this.show) this.draw(...this.rotations);
        }
      }
    });
    this.x = verify(config.x, this.c.width / 2);
    this.y = verify(config.y, this.c.height / 2);
    this.color = verify(verify(config.color, themes[theme.color].gradientLight), "#888888");
    this.width = verify(config.width, 2 * this.c.width / 3);
    //this.height = this.radius * Math.sqrt(3);
    this.draw = (x, y, z) => {
      x = verify(x, 0);
      y = verify(y, 0);
      z = verify(z, 0);
      this.clear(false);
      this.shape(x, y, z, 0);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      this.rotations = [x, y, z];
    };
    this.spin = () => {

    };
    this.clear = (save, add) => {
      if (this.show) {
        //if (typeof add !== "number") add = 0.5;
        add = verify(add, 0.5);
        let x = this.rotations[0];
        let y = this.rotations[1];
        let z = this.rotations[2];
        this.stop();
        this.ctx.save();
        this.shape(x, y, z, add);
        /*this.ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
        for (let side = 0; side <= this.sides; side++) {
          this.ctx.lineTo(this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(side * 2 * Math.PI / this.sides + Math.PI * z / this.angle), this.y + (this.radius - add - (Math.cos(x * Math.PI / 180) + 1) * this.radius) * Math.sin(side * 2 * Math.PI / this.sides + Math.PI * z / this.angle));
        }*/
        this.ctx.clip();
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.ctx.restore();
        if (!save) this.rotations = [];
      }
    };
    this.stop = () => {
      clearInterval(this.loop);
    };
  }

  test(increment, start, config) {
    let shape = [];
    for (let i = start; i <= 30; i = i + increment) {
      setTimeout(() => {
        document.onclick = undefined;
        if (shape[i - increment]) shape[i - increment].clear();
        shape[i] = new Shape(i, config);
        shape[i].draw(0, 0, 0);
        document.onclick = () => { console.log(i); };
      }, 1000 * i);
    }
  }
}

window.Shape = Shape;

export default Shape;