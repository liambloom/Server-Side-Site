let verify = (...values) => {
  let final = values[values.length - 1];
  if (final === null) return null;
  else if (typeof final === "number" && isNaN(final)) return NaN;
  else if (final === undefined) return undefined;
  else {
    let correct = typeof final;
    let shouldBeArray = Array.isArray(final);
    let isNumber = typeof final === "number" || typeof final === "boolean"; // why is isNaN(booleanValue) false
    for (let i of values) {
      if (typeof i === correct && i !== null && (isNumber ^ isNaN(i)) && Array.isArray(i) === shouldBeArray) return i;
    }
  }
};

let secret = [];

export class Shape {
  constructor(sides, config) {
    this.__key__ = secret.length;
    for (let property of ["x", "color"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[this.__key__][property];
        },
        set: function (value) {
          if (this.show) clearApi(true, false);
          secret[this.__key__][property] = value;
          if (this.show && this.loop === -1) this.draw(...this.rotations);
        }
      });
    }
    for (let property of ["c", "ctx", "sides", "angle", "fpsArr", "fps", "rotations", "loop", "radius", "inradius", "height"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[this.__key__][property];
        }
      });
    }

    Object.defineProperties(this, {
      show: {
        get: function () {
          return this.rotations ? this.rotations.length === 3 : false;
        }
      },
      y: {
        get: function () {
          return secret[this.__key__].y;
        },
        set: function (value) {
          if (this.show && this.loop === -1) clearApi(true);
          let y;
          if (this.sides % 2 === 0 || this.center === "origin") y = value;
          else y = value + ((this.radius - (this.radius * Math.cos(Math.PI / this.sides))) / 2);
          secret[this.__key__].y = y;
          if (this.show && this.loop === -1) this.draw(...this.rotations);
        }
      },
      width: {
        get: function () {
          return secret[this.__key__][width];
        },
        set: function (value) {
          if (this.show && this.loop === -1) clearApi(true);
          secret[this.__key__].width = value;

          if (sides % 4 === 0) secret[this.__key__].radius = (value / 2) / Math.sin(Math.PI * this.angle / 360);
          else if (sides % 2 === 0) secret[this.__key__].radius = value / 2;
          else secret[this.__key__].radius = (value / Math.sin((this.sides / 2 - 0.5) * (360 / this.sides) * Math.PI / 180)) * Math.sin(Math.PI * (180 - (this.sides / 2 - 0.5) * (360 / this.sides)) / 360);
          secret[this.__key__].inradius = this.radius * Math.cos(Math.PI / this.sides);
          if (this.sides % 2 === 0) secret[this.__key__].height = this.inradius * 2;
          else secret[this.__key__].height = this.inradius + this.radius;
          if (this.show && this.loop === -1) this.draw(...this.rotations);
        }
      },
      center: {
        get: function () {
          return secret[this.__key__].center;
        },
        set: function (value) {
          if (this.sides % 2 !== 0) {
            if (value !== "origin" && value !== "vertical") throw "Center must be 'origin' or 'vertical'";
            if (this.show && this.loop === -1) clearApi(true);
            secret[this.__key__].center = value;
            this.y = this.y;
            if (this.show && this.loop === -1) this.draw(...this.rotations);
          }
          else console.warn("The center property only applies to shapes with odd numbers of sides");
        }
      }
    });

    config = verify(config, {});
    secret[this.__key__] = {
      sides: verify(sides, 4),
      fpsArr: [1],
      fps: verify(config.fps, 144),
      loop: -1
    };
    if ((typeof config.canvas === "object" && config.canvas !== null) ?
      (Object.getPrototypeOf(config.canvas) === HTMLCanvasElement.prototype) : false) {
      secret[this.__key__] = config.canvas;
    }
    else secret[this.__key__].c = document.getElementsByTagName("canvas")[0];
    if (!this.c) throw "There are no canvas elements on this page";
    secret[this.__key__].ctx = this.c.getContext('2d');
    secret[this.__key__].angle = 180 - 360 / this.sides;
    if (this.sides % 2 !== 0) this.center = verify(config.center, "origin");
    else if (config.center) console.warn("The center property only applies to shapes with odd numbers of sides");
    this.width = verify(config.width, 2 * this.c.width / 3);
    this.x = verify(config.x, this.c.width / 2);
    this.y = verify(config.y, this.c.height / 2);
    this.color = verify(config.color, themes[theme.color].gradientLight, "#888888");

    let shape = (function shape(x, y, z, add) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
      if (this.sides % 4 === 0) z += 180 / this.sides;
      else if (this.sides % 2 !== 0) z += 90;
      for (let side = 0; side <= this.sides; side++) {
        let a = side * 2 * Math.PI / this.sides + (this.sides - 2) * Math.PI * z / (this.angle * this.sides);
        this.ctx.lineTo(this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(a), this.y + (this.radius - add - (Math.cos(x * Math.PI / 180) + 1) * this.radius) * Math.sin(a));
      }
    }).bind(this);

    let clearApi = (function clearApi(save, stop, add) {
      if (this.show) {
        save = verify(save, false);
        stop = verify(stop, true);
        add = verify(add, 0.5);
        let x = this.rotations[0];
        let y = this.rotations[1];
        let z = this.rotations[2];
        if (stop) this.stop();
        this.ctx.save();
        shape(x, y, z, add);
        this.ctx.clip();
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.ctx.restore();
        if (!save) secret[this.__key__].rotations = [];
      }
    }).bind(this);

    this.draw = (x, y, z) => {
      let axes = { x, y, z };
      for (let name in axes) {
        let a = axes[name];
        if (typeof a === "string") {
          let value = parseFloat(a);
          let unit = a.replace(/\d*\.?\d+\s?/, "");
          if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) a = value * 180 / Math.PI;
          else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) a = value;
          else throw unit + " is not a valid unit";
        }
        axes[name] = verify(a, 0);
      }
      ({ x, y, z } = axes);
      this.clear();
      shape(x, y, z, 0);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      secret[this.__key__].rotations = [x, y, z];
    };
    this.spin = (axis, input1, input2, start) => {
      let dpms, degrees, ms, axes;
      let disapear = false;
      if (typeof start === "string") {
        let value = parseFloat(start);
        let unit = start.replace(/\d*\.?\d+\s?/, "");
        if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) start = value * 180 / Math.PI;
        else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) start = value;
        else throw unit + " is not a valid unit";
      }
      else if (start === undefined) start = 0;
      else throw start + " is not a valid starting point";
      if (typeof axis !== "string") throw 'Axis must be "x", "y", or "z"';
      else if (/^x$/i.test(axis)) axes = [];
      else if (/^y$/i.test(axis)) axes = [0];
      else if (/^z$/i.test(axis)) axes = [0, 0];
      else throw 'Axis must be "x", "y", or "z"';
      for (let i of [input1, input2]) {
        if (typeof i !== "string") throw i + " is not a valid input";
        if (/^\s*infinit(?:e(?:ly)?|y)\s*$/i.test(i)) {
          ms = Infinity;
          degrees = Infinity;
        }
        else {
          let value = parseFloat(i);
          let unit = i.replace(/\d*\.?\d+\s*(.*)/, "$1").replace(/\s*$/, "");
          if (isNaN(value)) throw i + " is not a valid measurement";
          if (/^m(?:in(?:ute)?s?)?$/i.test(unit)) ms = value * 60000; // minutes
          else if (/^s(?:ec(?:ond)?s?)?$/i.test(unit)) ms = value * 1000; // seconds
          else if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) degrees = value * 180 / Math.PI; // radians
          else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) degrees = value; // degrees
          else if (/^rot(?:ations?)?\s*$/i.test(unit)) degrees = value * 360; // rotations
          else if (/^r(?:otations)?\s*(?:p(?:er)?|\/)\s*m(?:in(?:ute)?)?$/i.test(unit)) dpms = 360 * value / 60000; // rpm
          else if (/^r(?:otations)?\s*(?:p(?:er)?|\/)\s*s(?:ec(?:ond)?)?$/i.test(unit)) dpms = 360 * value / 1000; // rps
          else throw unit + " is not a valid unit";
        }
      }
      if ((ms === Infinity || degrees === Infinity) && dpms === undefined) throw "Spin speed must be specified to spin infinitely";
      if (dpms !== undefined && degrees !== undefined) ms = degrees / dpms;
      else if (ms !== undefined && degrees !== undefined) dpms = degrees / ms;
      if (dpms === undefined || ms === undefined) throw "Not enouph information to spin shape";
      let checker = (degrees + start + 90) % 180;
      if (checker < 1 || checker > 179) disapear = true;

      let startTime = performance.now();
      let end = startTime + ms - 1;
      axes.push(start);
      this.draw(...axes);
      axes.pop();
      secret[this.__key__].loop = setInterval(() => {
        if (performance.now() >= end) {
          if (disapear) this.clear();
          else this.stop();
        }
        else {
          clearApi(false, false, 1);
          let angle = (performance.now() - startTime) * dpms + start;
          if (angle % 360 < 180 || axes.length === 2) axes.push(angle);
          else axes.push(angle + 180);
          this.draw(...axes);
          axes.pop();
        }
      }, 1000 / this.fps);
    };
    this.clear = () => {
      clearApi();
    };
    this.stop = () => {
      clearInterval(this.loop);
      secret[this.__key__].loop = -1;
    };
  }
}

export class HexGrid {
  constructor(config) {
    config = verify(config, {});
    config.grid = verify(config.grid, {});
    this.hexagons = [];
    let c, minX, minY, maxX, maxY, offsetFinalX, offsetFinalY;
    if ((typeof config.canvas === "object" && config.canvas !== null) ?
      (Object.getPrototypeOf(config.canvas) === HTMLCanvasElement.prototype) : false) {
      c = config.canvas;
    }
    else c = document.getElementsByTagName("canvas")[0];
    let gridX = verify(config.grid.x, 0);
    let gridY = verify(config.grid.y, 0);
    let height = verify(config.grid.height, c.height);
    let width = verify(config.grid.width, c.width);
    let shapeWidth = verify(config.width, 30);
    let radius = shapeWidth / 2;
    let inradius = radius * Math.cos(Math.PI / 6);
    let side = 2 * radius * Math.sin(Math.PI / 6);
    let shapeHeight = inradius * 2;
    config.width = shapeWidth;

    let addShape = (function(config, x, y) {
      config.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
      config.x = x;
      config.y = y;
      let hex = new Shape(6, config);
      this.hexagons.push(hex);
    }).bind(this);

    //lots of stuff in this if statement are wrong
    if (verify(config.grid.allowOverflow, false)) { 
      minX = gridX - (side / 2);
      minY = gridY;
      maxX = width + gridX + shapeWidth + /*side*/ - width % (shapeWidth + side);
      maxY = height + gridY + shapeHeight - height % shapeHeight;
      offsetFinalX = (width + gridX - (maxX - side)) > (side / 2);
      offsetFinalY = (height + gridY - maxY) > 0;
    }
    else {
      minX = gridX + radius;
      minY = gridY + inradius;
      maxX = Math.ceil((width + gridX - radius) / shapeWidth) * shapeWidth - radius;
      maxY = Math.floor((height + gridY - inradius) / shapeHeight) * shapeHeight - inradius;
      offsetFinalX = (width - maxX) >= shapeWidth;
      offsetFinalY = (height - maxY) >= shapeHeight;
    }

    for (let x = minX; x <= maxX; x = x + shapeWidth + side) {
      for (let y = minY; y <= maxY; y = y + shapeHeight) {
        addShape(config, x, y);
        if ((offsetFinalX || x + shapeWidth + side <= maxX) && (offsetFinalY || y + shapeHeight <= maxY)) addShape(config, x + radius + (side / 2), y + inradius);
      }
    }
    
    this.draw = () => {
      this.hexagons.forEach(hex => {
        hex.draw();
      });
    };

    this.spin = (axis, input1, input2, start) => {
      this.hexagons.forEach(hex => {
        hex.spin(axis, input1, input2, start);
      });
    };

    this.stop = () => {
      this.hexagons.forEach(hex => {
        hex.stop();
      });
    };

    this.clear = () => {
      this.hexagons.forEach(hex => {
        hex.clear();
      });
    };
  }
}