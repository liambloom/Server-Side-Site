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
let verify = (...values) => {
  let correct = typeof values[values.length - 1];
  for (let i of values) {
    if (typeof i === correct) return i;
  }
};

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

let secret = [];

class Shape {
  constructor(sides, config) {
    this.__key__ = secret.length;
    secret[this.__key__] = {};
    for (let property of ["x", "color"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[this.__key__][property];
        },
        set: function (value) {
          if (this.show) this.clear(true);
          secret[this.__key__][property] = value;
          if (this.show) this.draw(...this.rotations);
        }
      });
    }
    for (let property of ["c", "ctx", "sides", "angle", "fpsArr", "framerate", "rotations", "loop", "radius"]) {
      Object.defineProperty(this, property, {
        get: function() {
          return secret[this.__key__][property];
        }
      });
    }

    Object.defineProperties(this, {
      show: {
        get: function() {
          return this.rotations.length === 3;
        }
      },
      /*x: {
        configurable: true,
        set: function(value) {
          if (this.show) this.clear(true);
          Object.defineProperty(this, "x", {
            get: function() {
              return value;
            }
          });
          if (this.show) this.draw(...this.rotations);
        }
      },*/
      y: {
        get: function () {
          return secret[this.__key__].y;
        },
        set: function (value) {
          if (this.show) this.clear(true);
          let y;
          if (this.sides % 2 === 0 || this.center === "origin") y = value;
          else y = value + ((this.radius - (this.radius * Math.cos(Math.PI / this.sides))) / 2);
          secret[this.__key__].y = y;
          if (this.show) this.draw(...this.rotations);
        }
      },
      /*color: {
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
      },*/
      width: {
        get: function () {
          return secret[this.__key__][width];
        },
        set: function (value) {
          if (this.show) this.clear(true);
          secret[this.__key__].width = value;
          
          if (sides % 4 === 0) secret[this.__key__].radius = (value / 2) / Math.sin(Math.PI * this.angle / 360);
          else if (sides % 2 === 0) secret[this.__key__].radius = value / 2;
          else secret[this.__key__].radius = (value / Math.sin((this.sides / 2 - 0.5) * (360 / this.sides) * Math.PI / 180)) * Math.sin(Math.PI * (180 - (this.sides / 2 - 0.5) * (360 / this.sides)) / 360);
          if (this.show) this.draw(...this.rotations);
        }
      },
      center: {
        get: function () {
          return secret[this.__key__].center;
        },
        set: function (value) {
          if (this.sides % 2 !== 0) {
            if (value !== "origin" && value !== "vertical") throw "Center must be 'origin' or 'vertical'";
            secret[this.__key__].center = value;
            this.y = this.y;
          }
          else console.warn("The center property only applies to shapes with odd numbers of sides");
        }
      }
    });

    config = verify(config, {});
    secret[this.__key__].c = verify(config.canvas, document.getElementsByTagName("canvas")[0]);
    secret[this.__key__].ctx = this.c.getContext('2d');
    secret[this.__key__].sides = verify(sides, 4);
    secret[this.__key__].angle = 180 - 360 / this.sides;
    secret[this.__key__].fpsArr = [1];
    secret[this.__key__].framerate = verify(config.fps, fps, 60);
    secret[this.__key__].rotations = [];
    secret[this.__key__].loop = -1;
    if (this.sides % 2 !== 0) this.center = verify(config.center, "origin");
    else if (config.center) console.warn("The center property only applies to shapes with odd numbers of sides");
    this.width = verify(config.width, 2 * this.c.width / 3);
    this.x = verify(config.x, this.c.width / 2);
    this.y = verify(config.y, this.c.height / 2);
    this.color = verify(config.color, themes[theme.color].gradientLight, "#888888");

    this.draw = (x, y, z) => {
      x = verify(x, 0);
      y = verify(y, 0);
      z = verify(z, 0);
      this.clear(false);
      this.shape(x, y, z, 0);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      secret[this.__key__].rotations = [x, y, z];
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
        shape.call(this, x, y, z, add);
        /*this.ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
        for (let side = 0; side <= this.sides; side++) {
          this.ctx.lineTo(this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(side * 2 * Math.PI / this.sides + Math.PI * z / this.angle), this.y + (this.radius - add - (Math.cos(x * Math.PI / 180) + 1) * this.radius) * Math.sin(side * 2 * Math.PI / this.sides + Math.PI * z / this.angle));
        }*/
        this.ctx.clip();
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.ctx.restore();
        if (!save) secret[this.__key__].rotations = [];
      }
    };
    this.stop = () => {
      clearInterval(this.loop);
    };
  }

  test(increment, start, config, axis) {
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
}

window.Shape = Shape;

export default Shape;