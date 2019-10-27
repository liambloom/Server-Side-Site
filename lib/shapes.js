let verify = (...values) => { // Retuns first argument that is same type as final argument
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

let spinInput = (input1, input2) => { // processes 2 inputs (speed, time, or distance) and outputs 3. Also converts units
  let ms, degrees, dpms;
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
  return {dpms, ms, degrees};
};

let secret = [];

Math.distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); // find distance between 2 points

export class Shape {
  constructor(sides, config) {
    let key = secret.length; // index of this shape's variables stored in secret. This is my implementation of private properties
    for (let property of ["x", "color"]) {
      Object.defineProperty(this, property, {
        get: function () { // Return the called property, which is stored in secret
          return secret[key][property]; 
        },
        set: function (value) { // update the property, and also redraw the shape if it is visible
          if (this.show && this.loop === -1) clearApi(true, false);
          else if (this.show) clearApi(false, false);
          secret[key][property] = value;
          if (this.show) this.draw(...this.rotations);
        }
      });
    }
    for (let property of ["c", "ctx", "sides", "angle", "fpsArr", "fps", "loop", "radius", "inradius", "height", "points"]) {
      Object.defineProperty(this, property, {
        get: function () { // get the property from secret. There is no setter, so they cannot be set from outside this shape
          return secret[key][property];
        }
      });
    }

    Object.defineProperties(this, {
      show: {
        get: function () { // check if this shape is shown, and return a boolean value
          return this.rotations ? this.rotations.length === 3 : false;
        }
      },
      y: {
        get: function () {
          return secret[key].y;
        },
        set: function (value) {
          if (this.show && this.loop === -1) clearApi(true, false);
          else if (this.show) clearApi(false, false);
          let y;
          if (this.sides % 2 === 0 || this.center === "origin") y = value;
          else y = value + ((this.radius - (this.radius * Math.cos(Math.PI / this.sides))) / 2);
          secret[key].y = y;
          if (this.show) this.draw(...this.rotations);
        }
      },
      width: {
        get: function () {
          return secret[key].width;
        },
        set: function (value) {
          if (this.show && this.loop === -1) clearApi(true, false);
          else if (this.show) clearApi(false, false);
          secret[key].width = value;

          if (sides % 4 === 0) secret[key].radius = (value / 2) / Math.sin(Math.PI * this.angle / 360);
          else if (sides % 2 === 0) secret[key].radius = value / 2;
          else secret[key].radius = (value / Math.sin((this.sides / 2 - 0.5) * (360 / this.sides) * Math.PI / 180)) * Math.sin(Math.PI * (180 - (this.sides / 2 - 0.5) * (360 / this.sides)) / 360);
          secret[key].inradius = this.radius * Math.cos(Math.PI / this.sides);
          if (this.sides % 2 === 0) secret[key].height = this.inradius * 2;
          else secret[key].height = this.inradius + this.radius;
          if (this.show) this.draw(...this.rotations);
        }
      },
      center: {
        get: function () {
          return secret[key].center;
        },
        set: function (value) { // shapes with and odd numbers of sides have a vertical center different from the actual center
          if (this.sides % 2 !== 0) {
            if (value !== "origin" && value !== "vertical") throw "Center must be 'origin' or 'vertical'";
            if (this.show && this.loop === -1) clearApi(true, false);
            else if (this.show) clearApi(false, false);
            secret[key].center = value;
            this.y = this.y;
            if (this.show) this.draw(...this.rotations);
          }
          else console.warn("The center property only applies to shapes with odd numbers of sides");
        }
      },
      rotations: {
        get: function() {
          return secret[key].rotations;
        },
        set: function(value) {
          if (this.show && Array.isArray(value)) {
            //console.log(value);
            value.length = 3;
            for (let i = 0; i < 3; i++) {
              value[i] = verify(value[i], 0);
            }
            if (this.show) clearApi();
            secret[key].rotations = value;
            if (this.show) this.draw(...this.rotations);
          }
        }
      }
    });

    //This block of code sets all the variables
    config = verify(config, {}); // just in case the config was left blank
    secret[key] = { // easily set a few values
      sides: verify(sides, 4),
      points: [],
      fpsArr: [1],
      fps: verify(config.fps, 60),
      loop: -1
    };
    if ((typeof config.canvas === "object" && config.canvas !== null) ? // if config.canvas is an object
      (Object.getPrototypeOf(config.canvas) === HTMLCanvasElement.prototype) : false) { // and it's a canvas
      secret[key].c = config.canvas; // this.c = config.canvas
    }
    else secret[key].c = document.getElementsByTagName("canvas")[0]; // else this.c = the first canvas on the page
    if (!this.c) throw "There are no canvas elements on this page";
    secret[key].ctx = this.c.getContext('2d');
    secret[key].angle = 180 - 360 / this.sides;
    if (config.center || this.sides % 2 !== 0) this.center = verify(config.center, "origin");
    this.width = verify(config.width, 2 * this.c.width / 3);
    this.x = verify(config.x, this.c.width / 2);
    this.y = verify(config.y, this.c.height / 2);
    this.color = verify(config.color, "#808080");

    let shape = (function shape(x, y, z, add) { // draws out the points for the shape
      secret[key].points = [];
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
      if (this.sides % 4 === 0) x += 180 / this.sides;
      else if (this.sides % 2 !== 0) x += 90;
      for (let side = 0; side <= this.sides; side++) {
        let a = side * 2 * Math.PI / this.sides + (this.sides - 2) * Math.PI * x / (this.angle * this.sides);
        let point = [this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(a), this.y + (this.radius - add - (Math.cos(z * Math.PI / 180) + 1) * this.radius) * Math.sin(a)]
        secret[key].points.push(point); // update this.points
        this.ctx.lineTo(...point);
      }
      secret[key].points.pop();
    }).bind(this);

    let clearApi = (function (save, stop, add) { // clears shapes with inputs that should not be accesed from the outside
      if (this.show) {
        save = verify(save, false); // !reset rotations?
        stop = verify(stop, true); // stop spinning?
        add = verify(add, 0.5); // clear how many pixels around shape (beacuse for some reason there is a leftover border)
        let x = this.rotations[0];
        let y = this.rotations[1];
        let z = this.rotations[2];
        if (stop) this.stop();
        this.ctx.save();
        shape(x, y, z, add);
        this.ctx.clip();
        this.ctx.clearRect(0, 0, this.c.width, this.c.height);
        this.ctx.restore();
        if (!save) secret[key].rotations = [];
      }
    }).bind(this);

    let drawApi = (function (x = 0, y = 0, z = 0) { // draw with number inputs, to increase preformance of spin function
      clearApi();
      shape(x, y, z, 0);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
      secret[key].rotations = [x, y, z];
    }).bind(this);

    this.draw = (x, y, z) => { // draw the shape
      let axes = { x, y, z };
      for (let name in axes) {
        let a = axes[name];
        if (typeof a === "string") { // convert axes to degrees
          let value = parseFloat(a);
          let unit = a.replace(/\d*\.?\d+\s?/, "");
          if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) a = value * 180 / Math.PI;
          else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) a = value;
          else throw unit + " is not a valid unit";
        }
        axes[name] = verify(a, 0); // verify axes
      }
      ({ x, y, z } = axes);
      drawApi(x, y, z);
    };

    this.spin = (axis, input1, input2, start) => { // spin the shape
      let axes;
      let disapear = false;
      if (typeof start === "string") { // convert starting angle to degrees
        let value = parseFloat(start);
        let unit = start.replace(/\d*\.?\d+\s?/, "");
        if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) start = value * 180 / Math.PI;
        else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) start = value;
        else throw unit + " is not a valid unit";
      }
      else if (start === undefined) start = 0;
      else throw start + " is not a valid starting point";
      if (typeof axis !== "string") throw 'Axis must be "x", "y", or "z"'; // what axis should it spin on
      else if (/^x$/i.test(axis)) axes = [];
      else if (/^y$/i.test(axis)) axes = [0];
      else if (/^z$/i.test(axis)) axes = [0, 0];
      else throw 'Axis must be "x", "y", or "z"'; // this must be seperate because /.../.test(not_a_string) throws an error
      
      let {dpms, ms, degrees} = spinInput(input1, input2); // call spinInput function (line 16)

      let checker = (degrees + start + 90) % 180; 
      if (checker < 1 || checker > 179) disapear = true; // if it will end paralell to the viewpoint, clear it

      let startTime = performance.now();
      let end = startTime + ms - 1;
      
      // Draw shape at starting position
      axes.push(start); 
      this.draw(...axes);
      axes.pop();

      secret[key].loop = setInterval(() => {
        let now = performance.now();
        if (now >= end) { // if time is up
          if (disapear) clearApi();
          this.stop();
        }
        else {
          clearApi(false, false, 1);
          let angle = (now - startTime) * dpms + start; // calculate angle based on time
          if (angle % 360 < 180 || axes.length === 0) axes.push(angle);
          else axes.push(angle + 180); // the up part of a cosine wave messes up clear function for x and y spinning
          drawApi(...axes);
          axes.pop();
        }
      }, 1000 / this.fps);
    };
    this.clear = () => {
      clearApi();
    };
    this.stop = () => {
      clearInterval(this.loop);
      secret[key].loop = -1;
      secret[key].fpsRecord = undefined;
    };
  }
}

export class HexGrid {
  constructor(config) {
    config = verify(config, {});
    config.grid = verify(config.grid, {});
    let key = secret.length;
    secret[key] = {};
    if ((typeof config.canvas === "object" && config.canvas !== null) ?
      (Object.getPrototypeOf(config.canvas) === HTMLCanvasElement.prototype) : false) {
      secret[key].c = config.canvas;
    }
    else secret[key].c = document.getElementsByTagName("canvas")[0];
    if (this.c === null) throw "There are no canvases on this page";
    for (let property of ["hexagons", "c", "ctx", "shown", "spinning"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[key][property];
        }
      });
    }
    for (let property of ["gridX", "gridY", "gridHeight", "width", "gridWidth", "allowOverflow"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[key][property];
        },
        set: function (value) {
          let shown = this.shown;
          let reset = () => {
            clearApi();
            secret[key][property] = value;
            secret[key].hexagons = [];
            config.width = this.width;
            makeGrid();
          };
          if (this.spinning) {
            console.warn(`HexGrid will not update the ${property} until spinning is stopped`);
            this.c.addEventListener(`$HexGrid${key}Stopped$`, reset);
          }
          else if (shown) {
            clearApi();
            reset();
            this.draw();
          }
          else reset();
        } 
      });
    }
    Object.defineProperty(this, "color", {
      get: function () {
        return secret[key].color;
      },
      set: function (value) {
        secret[key].color = value;
        this.hexagons.forEach(hex => {
          hex.color = value;
        });
      }
    });
    secret[key].ctx = this.c.getContext("2d");
    secret[key].shown = false;
    secret[key].spinning = false;
    secret[key].gridX = verify(config.grid.x, 0);
    secret[key].gridY = verify(config.grid.y, 0);
    secret[key].gridHeight = verify(config.grid.height, this.c.height);
    secret[key].gridWidth = verify(config.grid.width, this.c.width);
    secret[key].width = verify(config.width, 30);
    secret[key].allowOverflow = verify(config.grid.allowOverflow, false);
    secret[key].hexagons = [];
    let calculated = {
      radius: function () { return this.width / 2; },
      inradius: function () { return this.radius * Math.cos(Math.PI / 6); },
      side: function () { return 2 * this.radius * Math.sin(Math.PI / 6); },
      shapeHeight: function () { return this.inradius * 2; },
      minX: function () { return this.allowOverflow ? this.gridX - (this.side / 2) : this.gridX + this.radius; },
      minY: function () { return this.allowOverflow ? this.gridY : this.gridY + this.inradius; },
      maxX: function () { return this.allowOverflow ? this.gridX + this.gridWidth + this.radius : this.gridX + this.gridWidth - this.radius; },
      maxY: function () { return this.allowOverflow ? this.gridY + this.gridHeight + this.inradius : this.gridY + this.gridHeight - this.inradius; }
    };
    for (let property in calculated) {
      Object.defineProperty(this, property, {
        get: calculated[property]
      });
    }    
    
    config.width = this.width;

    let addShape = (function(config, x, y) {
      config.x = x;
      config.y = y;
      let hex = new Shape(6, config);
      this.hexagons.push(hex);
    }).bind(this);

    let makeGrid = (function() {
      for (let x = this.minX; x <= this.maxX; x += this.radius + (this.side / 2)) {
        let offset = (this.allowOverflow ^ (Math.ceil(x / (this.radius + (this.side / 2))) % 2)) ? this.inradius : 0;
        for (let y = this.minY + offset; y <= this.maxY; y += this.shapeHeight) {
          addShape(config, x, y);
        }
      }
    }).bind(this);

    makeGrid();
    
    this.draw = () => {
      if (this.spinning) this.c.dispatchEvent(new Event(`$HexGrid${key}Stopped$`));
      secret[key].shown = true;
      this.hexagons.forEach(hex => {
        hex.draw();
      });
    };

    this.spin = (axis, input1, input2, start, origin, time, cb) => {
      if (this.spinning) this.c.dispatchEvent(new Event(`$HexGrid${key}Stopped$`));
      if (typeof origin === "string") origin = origin.replace(/\(|\)/g, "").split(",");
      origin = verify(origin, [0, 0]);
      if (origin[0] < 0 || origin[0] > this.gridWidth || origin[1] < 0 || origin[1] > this.gridHeight) throw "The origin must be inside the grid";
      time = verify(time, "0 secs");
      let spinTime = spinInput(input1, input2).ms;
      if (spinTime === Infinity) spinTime = 0;
      let timeFloat = parseFloat(time);
      let timeUnit = time.replace(/\d*\.?\d+\s*(.*)/, "$1").replace(/\s*$/, "");
      if (isNaN(timeFloat)) throw time + " is not a valid measurement";
      if (/^m(?:in(?:ute)?s?)?$/i.test(timeUnit)) time = timeFloat * 60000 - spinTime; // minutes
      else if (/^s(?:ec(?:ond)?s?)?$/i.test(timeUnit)) time = timeFloat * 1000 - spinTime; // seconds
      let times = [];
      let max = Math.max(
        Math.distance(0, 0, ...origin), 
        Math.distance(this.gridWidth, 0, ...origin),
        Math.distance(0, this.gridHeight, ...origin),
        Math.distance(this.gridWidth, this. gridHeight, ...origin)
      );
      secret[key].spinning = true;
      this.hexagons.forEach(hex => {
        hex.draw();
        if (!time) hex.spin(axis, input1, input2, start);
        else {
          let timeout = Math.distance(hex.x, hex.y, ...origin) / max * (time);
          times.push(timeout);
          setTimeout(() => {
            hex.spin(axis, input1, input2, start);
          }, timeout);
        }
      });
      if (typeof cb === "function") {
        setTimeout(() => {
          cb();
        }, Math.max(...times) + spinTime);
      }
      if (!/^(?:[^|]*\|)?\s*infinit(?:e(?:ly)?|y)\s*(?:\|[^|]*)?$/i.test(`${input1}|${input2}`)) {
        setTimeout(() => {
          this.c.dispatchEvent(new Event(`$HexGrid${key}Stopped$`));
        }, Math.max(...times) + spinTime);
      }
    };

    this.stop = () => {
      secret[key].spinning = false;
      this.hexagons.forEach(hex => {
        hex.stop();
      });
      this.c.dispatchEvent(new Event(`$HexGrid${key}Stopped$`));
    };

    this.clear = () => {
      secret[key].shown = false;
      if (this.spinning) {
        secret[key].spinning = false;
        this.c.dispatchEvent(new Event(`$HexGrid${key}Stopped$`));
      }
      else {
        this.hexagons.forEach(hex => {
          hex.clear();
        });
      }
    };
  }
}