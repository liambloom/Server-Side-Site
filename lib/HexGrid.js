import Shape from "./Shapes.js";

const verify = (...values) => { // Returns first argument that is same type as final argument
  const final = values[values.length - 1];
  if (final === null) return null;
  else if (typeof final === "number" && isNaN(final)) return NaN;
  else if (final === undefined) return undefined;
  else {
    const correct = typeof final;
    const shouldBeArray = Array.isArray(final);
    const isNumber = typeof final === "number" || typeof final === "boolean"; // why is isNaN(booleanValue) false
    for (let i of values) {
      if (typeof i === correct && i !== null && (isNumber ^ isNaN(i)) && Array.isArray(i) === shouldBeArray) return i;
    }
  }
};

let secret = [];

export default class HexGrid {
  constructor(config) {
    config = verify(config, {});
    config.grid = verify(config.grid, {});
    this._key = secret.length;
    secret[this._key] = {};
    if ((typeof config.canvas === "object" && config.canvas !== null) ?
      (Object.getPrototypeOf(config.canvas) === HTMLCanvasElement.prototype) : false) {
      secret[this._key].canvas = config.canvas;
    }
    else secret[this._key].canvas = document.getElementsByTagName("canvas")[0];
    if (this.canvas === null) throw new Error("There are no canvases on this page");
    for (let property of ["config", "hexagons", "canvas", "ctx", "shown", "spinning"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[this._key][property];
        }
      });
    }
    for (let property of ["gridX", "gridY", "gridHeight", "width", "gridWidth", "allowOverflow"]) {
      Object.defineProperty(this, property, {
        get: function () {
          return secret[this._key][property];
        },
        set: function (value) {
          const reset = () => {
            this.clear();
            secret[this._key][property] = value;
            secret[this._key].hexagons = [];
            config.width = this.width;
            this._makeGrid();
          };
          if (this.spinning) {
            console.warn(`HexGrid will not update the ${property} until spinning is stopped`);
            this.canvas.addEventListener(`$HexGrid${this._key}Stopped$`, reset);
          }
          else if (this.shown) {
            this.clear();
            reset();
            this.draw();
          }
          else reset();
        }
      });
    }
    secret[this._key].config = config;
    secret[this._key].ctx = this.canvas.getContext("2d");
    secret[this._key].shown = false;
    secret[this._key].spinning = false;
    secret[this._key].gridX = verify(config.grid.x, 0);
    secret[this._key].gridY = verify(config.grid.y, 0);
    secret[this._key].gridHeight = verify(config.grid.height, this.canvas.height);
    secret[this._key].gridWidth = verify(config.grid.width, this.canvas.width);
    secret[this._key].width = verify(config.width, 30);
    secret[this._key].allowOverflow = verify(config.grid.allowOverflow, false);
    secret[this._key].hexagons = [];
    const calculated = { // The reason I didn't do this with shapes is because there are only two getter only properties
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

    this._makeGrid();
  }
  get Shape() {
    const config = this.config;
    return class extends Shape {
      constructor() {
        super(6, config);
      }
      spin(axis, input1, input2, start, time) {
        this._spinPrep(axis, input1, input2, start);
        const interval = setInterval(this._frame.bind(this), 1000 / Shape.fps);
        setTimeout(() => {
          clearInterval(interval);
        }, time);
      }
    };
  }
  get color() {
    return secret[this._key].color;
  }
  set color(value) {
    secret[this._key].color = value;
    this.hexagons.forEach(hex => {
      hex.color = value;
    });
  }
  _makeGrid() {
    for (let x = this.minX; x <= this.maxX; x += this.radius + (this.side / 2)) {
      const offset = (this.allowOverflow ^ (Math.ceil(x / (this.radius + (this.side / 2))) % 2)) ? this.inradius : 0;
      for (let y = this.minY + offset; y <= this.maxY; y += this.shapeHeight) {
        this.config.x = x;
        this.config.y = y;
        const hex = new this.Shape();
        this.hexagons.push(hex);
      }
    }
  }
  draw() {
    if (this.spinning) this.canvas.dispatchEvent(new Event(`$HexGrid${this._key}Stopped$`));
    secret[this._key].shown = true;
    this.hexagons.forEach(hex => {
      hex.draw();
    });
  }
  spin(axis, input1, input2, start, origin, time, cb) {
    if (this.spinning) this.canvas.dispatchEvent(new Event(`$HexGrid${this._key}Stopped$`));
    if (typeof origin === "string") origin = origin.replace(/\(|\)/g, "").split(",");
    origin = verify(origin, [0, 0]);
    if (origin[0] < 0 || origin[0] > this.gridWidth || origin[1] < 0 || origin[1] > this.gridHeight) throw new Error("The origin must be inside the grid");
    time = verify(time, "0 secs");
    let spinTime = Shape.prototype._spinInput(input1, input2).ms;
    if (spinTime === Infinity) spinTime = 0;
    const timeFloat = parseFloat(time);
    const timeUnit = time.replace(/\d*\.?\d+\s*(.*)/, "$1").replace(/\s*$/, "");
    if (isNaN(timeFloat)) throw new Error(time + " is not a valid measurement");
    if (/^m(?:in(?:ute)?s?)?$/i.test(timeUnit)) time = timeFloat * 60000 - spinTime; // minutes
    else if (/^s(?:ec(?:ond)?s?)?$/i.test(timeUnit)) time = timeFloat * 1000 - spinTime; // seconds
    let times = [];
    secret[this._key].spinning = true;
    this.hexagons.forEach(hex => {
      hex.draw();
      if (!time) hex.spin(axis, input1, input2, start, spinTime);
      else {
        const max = Math.max(
          Math.distance(0, 0, ...origin),
          Math.distance(this.gridWidth, 0, ...origin),
          Math.distance(0, this.gridHeight, ...origin),
          Math.distance(this.gridWidth, this.gridHeight, ...origin)
        );
        const timeout = Math.distance(hex.x, hex.y, ...origin) / max * time;
        times.push(timeout);
        setTimeout(() => {
          hex.spin(axis, input1, input2, start, spinTime);
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
        this.canvas.dispatchEvent(new Event(`$HexGrid${this._key}Stopped$`));
      }, Math.max(...times) + spinTime);
    }
  }
  clear() {
    secret[this._key].shown = false;
    if (this.spinning) {
      secret[this._key].spinning = false;
      this.canvas.dispatchEvent(new Event(`$HexGrid${this._key}Stopped$`));
    }
    else {
      this.hexagons.forEach(hex => {
        hex.clear();
      });
    }
  }
  stop() {
    secret[this._key].spinning = false;
    this.hexagons.forEach(hex => {
      hex.stop();
    });
    this.canvas.dispatchEvent(new Event(`$HexGrid${this._key}Stopped$`));
  }
}