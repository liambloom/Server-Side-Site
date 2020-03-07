/*
  Bugs:
    Edit: I think the newer shapes are just more complex and take more time to make, so making 1400 of them doesn't happen Original: HexGrid has infinite recursion (see  homepage.js for error)
    When canvasSafe is false:
     every even numbered spin (the cosine wave is going up) leaves a trail
     edges of shapes are left behind when the shape is moved or hidden
      * straight vertical or horizontal sides don't leave traces because of the added 0.5px cleared (line 363, inside method _clearApi)
  
  Performance Issues:
    _shapeVars.axes is very inefficient
    The constructor takes a long time
    init time is bad (i think)
*/

import pip from "/js/point-in-polygon.js";
import RightClickMenu from "./RightClickMenu.js";

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

let loop, slowLoop;
let secret = [];
let shapes = [];
let fpsTracker = [];

Math.distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); // find distance between 2 points
const mousePosition = (event, bcr) => new Float32Array([(event.clientX || event.changedTouches[0].clientX) - bcr.left - scrollX, (event.clientY || event.changedTouches[0].clientY) - bcr.top - scrollY]);
function drawFrame () {
  Shape.refreshAll();
  fpsTracker.unshift(performance.now());
  loop = requestAnimationFrame(drawFrame);
}

function onmousedown (event) {
  const held = Shape.shapeAtEvent(event);
  if (held) {
    Shape.held = held;
    held.toFront();
    const mousePos = mousePosition(event, this.getBoundingClientRect());
    held.xOffset = held.x - mousePos[0];
    held.yOffset = held.y - mousePos[1];
  }
}
function onmouseup () {
  Shape.held = undefined;
}
function onmousemove (event) {
  event.preventDefault();
  const held = Shape.held;
  if (held) {
    const mousePos = mousePosition(event, this.getBoundingClientRect());
    held.x = mousePos[0] + held.xOffset;
    held.y = mousePos[1] + held.yOffset;
  }
  if (Shape.shapeAtEvent(event)) this.style.setProperty("cursor", "move");
  else this.style.removeProperty("cursor");
}
function oncontextmenu (event) {
  event.preventDefault();
  if (Shape.held) return;
  const clicked = Shape.shapeAtEvent(event);
  let menu;
  if (clicked) {
    clicked.toFront();
    menu = shapeMenu;
  }
  else {
    menu = canvasMenu;
  }
  menu.classList.add("open");
  menu.style.setProperty("left", `${event.clientX}px`);
  menu.style.setProperty("top", `${event.clientY}px`);
}
document.addEventListener("mouseup", onmouseup);
document.addEventListener("touchend", onmouseup);
const fontImport = document.createElement("link");
fontImport.setAttribute("rel", "stylesheet");
fontImport.setAttribute("type", "text/css");
fontImport.setAttribute("href", "https://fonts.googleapis.com/css?family=VT323&display=swap");
document.head.appendChild(fontImport);
const fpsDisplay = document.createElement("div");
fpsDisplay.style.setProperty("position", "fixed");
fpsDisplay.style.setProperty("display", "none");
fpsDisplay.style.setProperty("top", "0px");
fpsDisplay.style.setProperty("right", "0px");
fpsDisplay.style.setProperty("background-color", "black");
fpsDisplay.style.setProperty("font", "20px VT323, monospace");
fpsDisplay.style.setProperty("height", "20px");
fpsDisplay.style.setProperty("z-index", "2147483647"); // Max posable value (32-bit integer limit)
fpsDisplay.style.setProperty("color", "white");
document.body.appendChild(fpsDisplay);

const shapeMenu = new RightClickMenu([
  [
    "Send to Back",
    "Hide",
    "Stop"
  ],
  [
    "Hide All",
    "Show All",
    "Stop All"
  ]
]);
const canvasMenu = new RightClickMenu([
  [
    "Hide All",
    "Show All",
    "Stop All"
  ]
]);

class ShapePropertyUI {
  constructor (shape, propertyName, element, fromElementModifier, toElementModifier, onlyFront = false) {
    this.shape = shape;
    this.onlyFront = onlyFront;
    const property = shape[propertyName];
    const propertyType = typeof shape[propertyName];
    if (property === undefined) throw new Error(`The property "${propertyName}" doesn't exist`);
    this.propertyName = propertyName;
    this.element = element;
    if (propertyType === "function") this.listener = ["click", () => {
      shape[propertyName]();
    }];
    else {
      if (!(element instanceof HTMLInputElement)) throw new Error(`${element} is not an HTML input`);
      this.directCorelation = true;
      const propertyInfo = Object.getOwnPropertyDescriptor(shape, propertyName) || Object.getOwnPropertyDescriptor(Shape.prototype, propertyName);
      if (!propertyInfo.configurable) throw new Error(`The property ${propertyName} is not configurable`);
      else if (propertyInfo.get && !propertyInfo.set) throw new Error(`${propertyName} is a getter only property`);
      else if (!propertyInfo.get && !propertyInfo.writable) throw new Error(`The property ${propertyName} is not writeable`);
      fromElementModifier = verify(fromElementModifier, v => v);
      if (propertyType !== typeof fromElementModifier(element.value)) throw new Error(`fromElementModifier does not produce the correct type: expected ${propertyType} but got ${typeof fromElementModifier(element.value)}`);
      toElementModifier = verify(toElementModifier, v => v);
      this.toElementModifier = toElementModifier;
      this.listener = ["input", event => { shape[propertyName] = fromElementModifier(event.target.value); }];
      element.value = toElementModifier(shape[propertyName]);
      const thisInClosure = this;
      if (propertyInfo.writable) {
        secret[shape._key][propertyName] = shape[propertyName];
        Object.defineProperty(shape, propertyName, {
          get: function () {
            return secret[this._key][propertyName];
          },
          set: function (value) {
            secret[shape._key][propertyName] = value;
            if (thisInClosure.active && (!onlyFront || this === Shape.inFront)) element.value = toElementModifier(value);
          },
          configurable: true
        });
      }
      else {
        Object.defineProperty(shape, propertyName, {
          get: propertyInfo.get,
          set: function (value) {
            if (thisInClosure.active && (!onlyFront || this === Shape.inFront)) element.value = toElementModifier(value);
            return propertyInfo.set.call(this, value);
          },
          configurable: true
        });
      }
    }
    this.activate();
  }
  activate () {
    this.active = true;
    if (this.directCorelation) this.element.value = this.toElementModifier(this.shape[this.propertyName]);
    this.element.addEventListener(...this.listener);
  }
  deactivate () {
    this.active = false;
    this.element.removeEventListener(...this.listener);
  }
}
class ShapePropertyUIList extends Array {
  constructor (shape, ...args) {
    super(...args);
    this.shape = shape;
  }
  activateAll () {
    for (let ui of this.inactive) {
      ui.activate();
    }
  }
  deactivateAll () {
    for (let ui of this.active) {
      ui.deactivate();
    }
  }
  add (propertyName, element, fromElementModifier, toElementModifier, onlyFront = false) {
    const newUI = new ShapePropertyUI(this.shape, propertyName, element, fromElementModifier, toElementModifier, onlyFront);
    this.push(newUI);
    return newUI;
  }
  get active () {
    return this.filter(ui => ui.active);
  }
  get inactive () {
    return this.filter(ui => !ui.active);
  }
  set inFront (value) {
    for (let ui of this) {
      if (ui.onlyFront) {
        if (value) ui.activate();
        else ui.deactivate();
      }
    }
  }
}

export default class Shape {
  constructor(sides, config) {
    this._key = secret.length; // index of this shape's variables stored in secret. This is my implementation of private properties
    for (let property of ["x", "color"]) {
      Object.defineProperty(this, property, {
        get: function () { // Return the called property, which is stored in secret
          return secret[this._key][property]; 
        },
        set: function (value) { // update the property, and also redraw the shape if it is visible
          if (this.show) this._clearApi(true, false);
          secret[this._key][property] = value;
          Shape.refreshAll();
        },
        configurable: true
      });
    }
    for (let property of ["canvas", "ctx", "sides", "angle", "points", "spinning", "_spinVars"]) {
      Object.defineProperty(this, property, {
        get: function () { // get the property from secret. There is no setter, so they cannot be set from outside this shape
          return secret[this._key][property];
        },
        configurable: true
      });
    }

    //This block of code sets all the variables
    config = verify(config, {}); // just in case the config was left blank
    secret[this._key] = { // easily set a few values
      sides: verify(sides, 4),
      spinning: false,
      rotations: new Float64Array(3),
      show: false
    };
    if ((typeof config.canvas === "object" && config.canvas !== null) ? // if config.canvas is an object
      (Object.getPrototypeOf(config.canvas) === HTMLCanvasElement.prototype) : false) { // and it's a canvas
      secret[this._key].canvas = config.canvas; // this.canvas = config.canvas
    }
    else secret[this._key].canvas = document.getElementsByTagName("canvas")[0]; // else this.canvas = the first canvas on the page
    if (!this.canvas) throw new Error("There are no canvas elements on this page");
    secret[this._key].ctx = this.canvas.getContext("2d");
    secret[this._key].angle = 180 - 360 / this.sides;
    secret[this._key].points = new Array(this.sides).fill(new Float64Array(2)); // Java equivalent would be new double[this.sides][2]
    if (this.sides % 2 !== 0) secret[this._key].center = verify(config.center, "origin");
    else if (config.center) console.warn("The center property only applies to shapes with odd numbers of sides");
    secret[this._key].width = verify(config.width, 2 * this.canvas.width / 3);
    secret[this._key].x = verify(config.x, this.canvas.width / 2);
    secret[this._key].y = verify(config.y, this.canvas.height / 2);
    secret[this._key].color = verify(config.color, "#888888");
    secret[this._key].draggable = verify(config.draggable, false);
    let canvasSafeSaved = this.canvas.getAttribute("data-isSafe");
    canvasSafeSaved = canvasSafeSaved === "true" ? true : canvasSafeSaved === "false" ? false : undefined;
    this.canvasSafe = verify(config.canvasSafe, canvasSafeSaved, !new Uint32Array(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data.buffer).some(color => color !== 0)); // Is canvas safe to clear completely
    if (config.canvasSafe !== undefined && canvasSafeSaved !== config.canvasSafe) {
      for (let shape of Shape.list.filter(shape => shape.canvas === canvas)) {
        shape.canvasSafe = config.canvasSafe;
      }
    }
    // The code that checks if the canvas is clear is from Austin Brunkhorst and Kaiido on StackOverflow
    this.canvas.setAttribute("data-isSafe", this.canvasSafe.toString());
    this.interfaces = new ShapePropertyUIList(this);
    for (let interfaceArgs of Shape.interfaces) {
      this.interfaces.add(...interfaceArgs);
    }

    if (!Shape.list.some(shape => shape.canvas === this.canvas)) {
      this.canvas.addEventListener("mousedown", onmousedown);
      this.canvas.addEventListener("touchstart", onmousedown);
      this.canvas.addEventListener("mousemove", onmousemove);
      this.canvas.addEventListener("touchmove", onmousemove);
      this.canvas.addEventListener("contextmenu", oncontextmenu);
    }

    const inFront = Shape.inFront;
    if (inFront) inFront.interfaces.inFront = false;
    this.interfaces.inFront = true;
    Shape.list.push(this);
  }
  get show () {
    return secret[this._key].show;
  }
  get radius () {
    if (this.sides % 4 === 0) return (this.width / 2) / Math.sin(Math.PI * this.angle / 360);
    else if (this.sides % 2 === 0) return this.width / 2;
    else return (this.width / Math.sin((this.sides / 2 - 0.5) * (360 / this.sides) * Math.PI / 180)) * Math.sin(Math.PI * (180 - (this.sides / 2 - 0.5) * (360 / this.sides)) / 360);
  }
  get inraduis () {
    return this.radius * Math.cos(Math.PI / this.sides);
  }
  get height () {
    if (this.sides % 2 === 0) return this.inradius * 2;
    else return this.inradius + this.radius;
  }
  get y () {
    return secret[this._key].y;
  }
  set y (value) {
    if (this.show) this._clearApi(true, false);
    if (this.sides % 2 === 0 || this.center === "origin") secret[this._key].y = value;
    else secret[this._key].y = value + ((this.radius - (this.radius * Math.cos(Math.PI / this.sides))) / 2);
    Shape.refreshAll();
  }
  get width () {
    return secret[this._key].width;
  }
  set width (value) {
    if (this.show) this._clearApi(true, false);
    secret[this._key].width = value;
    Shape.refreshAll();
  }
  get center () {
    return secret[this._key].center;
  }
  set center (value) { // shapes with and odd numbers of sides have a vertical center different from the actual center
    if (this.sides % 2 !== 0) {
      if (value !== "origin" && value !== "vertical") throw new Error("Center must be \"origin\" or \"vertical\"");
      if (this.show) this._clearApi(true, false);
      secret[this._key].center = value;
      //this.y = this.y;
      Shape.refreshAll();
    }
    else console.warn("The center property only applies to shapes with odd numbers of sides");
  }
  get rotations () {
    return secret[this._key].rotations;
  }
  get draggable () {
    return secret[this._key].draggable;
  }
  set draggable (value) {
    if (this.draggable !== value) secret[this._key].draggable = value;
  }
  _shape (x, y, z, add) { // draws out the points for the shape
    // performance could be improved by not calling "this.something" so many times. Especially this.radius, which is called 6 times and has a fairly long getter
    this.ctx.beginPath();
    //this.ctx.moveTo(this.x + this.radius * Math.cos(0), this.y + this.radius * Math.sin(0));
    if (this.sides % 4 === 0) x += 180 / this.sides;
    else if (this.sides % 2 !== 0) x += 90;
    for (let side = 0; side <= this.sides; side++) {
      const a = side * 2 * Math.PI / this.sides + (this.sides - 2) * Math.PI * x / (this.angle * this.sides);
      const point = new Float64Array(2);
      point[0] = this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(a);
      point[1] = this.y + (this.radius - add - (Math.cos(z * Math.PI / 180) + 1) * this.radius) * Math.sin(a);
      //const point = new Float64Array([this.x + (this.radius - add - (Math.cos(y * Math.PI / 180) + 1) * this.radius) * Math.cos(a), this.y + (this.radius - add - (Math.cos(z * Math.PI / 180) + 1) * this.radius) * Math.sin(a)]);
      if (side === 0) this.ctx.moveTo(...point);
      else {
        secret[this._key].points[side - 1] = point;
        this.ctx.lineTo(...point);
      }
    }
  }
  _drawApi (x = 0, y = 0, z = 0) { // draw with number inputs, to increase preformance of spin function
    this._shape(x, y, z, 0);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    const rotations = secret[this._key].rotations;
    rotations[0] = x;
    rotations[1] = y;
    rotations[2] = z;
  }
  _clearApi (save, stop, add) { // clears shapes with inputs that should not be accesed from the outside
    if (this.show) {
      save = false;//verify(save, true); // reset rotations?
      stop = verify(stop, true); // stop spinning?
      add = verify(add, !this.canvasSafe / 2); // clear how many pixels around shape (beacuse for some reason there is a leftover border)
      const x = this.rotations[0];
      const y = this.rotations[1];
      const z = this.rotations[2];
      if (stop) this.stop();
      this.ctx.save();
      this._shape(x, y, z, add);
      this.ctx.clip();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
      //if (!save) secret[this._key].rotations = new Float64Array(3);
    }
  }
  _spinInput (input1, input2) {
    let ms, degrees, dpms;
    for (let i of [input1, input2]) {
      if (typeof i !== "string") throw new Error(i + " is not a valid input");
      if (/^\s*in(?:de)?finit(?:e(?:ly)?|y)\s*$/i.test(i)) {
        ms = Infinity;
        degrees = Infinity;
      }
      else {
        const value = parseFloat(i);
        const unit = i.replace(/\d*\.?\d+\s*(.*)/, "$1").replace(/\s*$/, "");
        if (isNaN(value)) throw new Error(i + " is not a valid measurement");
        if (/^m(?:in(?:ute)?s?)?$/i.test(unit)) ms = value * 60000; // minutes
        else if (/^s(?:ec(?:ond)?s?)?$/i.test(unit)) ms = value * 1000; // seconds
        else if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) degrees = value * 180 / Math.PI; // radians
        else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) degrees = value; // degrees
        else if (/^rot(?:ations?)?\s*$/i.test(unit)) degrees = value * 360; // rotations
        else if (/^r(?:otations)?\s*(?:p(?:er)?|\/)\s*m(?:in(?:ute)?)?$/i.test(unit)) dpms = 360 * value / 60000; // rpm
        else if (/^r(?:otations)?\s*(?:p(?:er)?|\/)\s*s(?:ec(?:ond)?)?$/i.test(unit)) dpms = 360 * value / 1000; // rps
        else throw new Error(unit + " is not a valid unit");
      }
    }
    if ((ms === Infinity || degrees === Infinity) && dpms === undefined) throw new Error("Spin speed must be specified to spin infinitely");
    if (dpms !== undefined && degrees !== undefined) ms = degrees / dpms;
    else if (ms !== undefined && degrees !== undefined) dpms = degrees / ms;
    if (dpms === undefined || ms === undefined) throw new Error("Not enouph information to spin shape");
    return { dpms, ms, degrees };
  }
  _spinPrep (axis, input1, input2, start) {
    let axes;
    secret[this._key]._spinVars = {};
    if (typeof axis !== "string") throw new Error('Axis must be "x", "y", or "z"'); // what axis should it spin on
    else if (/^x$/i.test(axis)) axes = [];
    else if (/^y$/i.test(axis)) axes = [0];
    else if (/^z$/i.test(axis)) axes = [0, 0];
    else throw new Error('Axis must be "x", "y", or "z"'); // this must be seperate because /.../.test(not_a_string) throws an error
    if (typeof start === "string") { // convert starting angle to degrees
      const value = parseFloat(start);
      const unit = start.replace(/\d*\.?\d+\s?/, "");
      if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) start = value * 180 / Math.PI;
      else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) start = value;
      else throw new Error(unit + " is not a valid unit");
    }
    else if (start === undefined) start = this.rotations[axes.length];
    else throw new Error(start + " is not a valid starting point");

    const { dpms, ms, degrees } = this._spinInput(input1, input2); // call spinInput function (line 16)

    const checker = (degrees + start + 90) % 180;
    if (checker < 1 || checker > 179) this._spinVars.disappear = true; // if it will end paralell to the viewpoint, clear it
    else this._spinVars.disappear = false;

    this._spinVars.startTime = performance.now();
    this._spinVars.end = this._spinVars.startTime + ms - 1;
    this._spinVars.start = start;
    this._spinVars.axes = axes;
    this._spinVars.dpms = dpms;

    // Draw shape at starting position
    axes.push(start);
    this.draw(...axes);
    axes.pop();
  }
  _frame (clear = true) {
    const now = performance.now();
    if (now >= this._spinVars.end) { // if time is up
      if (this._spinVars.disappear) this.clear();
      this.stop();
    }
    else {
      if (clear) this._clearApi(false, false, 1);
      else secret[this._key].rotations.fill(0);
      const angle = (now - this._spinVars.startTime) * this._spinVars.dpms + this._spinVars.start; // calculate angle based on time
      if (angle % 360 < 180 || this._spinVars.axes.length === 0) this._spinVars.axes.push(angle);
      else this._spinVars.axes.push(angle/* + 180*/); // the up part of a cosine wave messes up clear function for x and y spinning
      this._drawApi(...this._spinVars.axes);
      this._spinVars.axes.pop();
    }
  }
  refresh (clear = true) {
    if (this.show && !this.spinning) this._drawApi(...this.rotations);
    if (this.spinning) this._frame(clear);
  }
  draw (x, y, z) {
    //this.clear();
    this.toFront(false);
    const axes = [ x, y, z ];
    for (let i in axes) {
      let a = axes[i];
      if (typeof a === "string") { // convert axes to degrees
        const value = parseFloat(a);
        const unit = a.replace(/\d*\.?\d+\s?/, "");
        if (/^r(?:ad(?:ian)?s?)?$/i.test(unit)) a = value * 180 / Math.PI;
        else if (/^d(?:eg(?:ree)?s?)?$/i.test(unit)) a = value;
        else throw new Error(unit + " is not a valid unit");
      }
      this.rotations[i] = verify(a, this.rotations[i]); // verify axes
    }

    //this._drawApi(...axes);
    Shape.refreshAll();
  }
  spin (axis, input1, input2, start) { // spin the shape
    this.toFront();
    this._spinPrep(axis, input1, input2, start);
    if (Shape.spinning.length === 0) {
      loop = requestAnimationFrame(drawFrame);
      if (Shape.displayFps) {
        fpsDisplay.style.setProperty("display", "initial");
        slowLoop = setInterval(() => {
          /*const fpsLength = slowFpsArr.length;
          slowFps = slowFpsArr.length ? Math.round(slowFpsArr.reduce((a, b) => a + b) / fpsLength) : 0; // This means I will get the average framerate over the last second
          slowFpsArr = [];*/
          let fps = Math.round(Shape.fps);
          /*if (fpsTracker.length > 1) {
            const now = performance.now();
            fpsTracker.splice(fpsTracker.findIndex(time => now - time > 1000));
            console.log(fpsTracker.length);
            //console.log(fpsTracker);
            let fpsCount = new Float64Array(fpsTracker.length - 1);
            for (let i in fpsCount) {
              //console.log(fpsTracker[i], fpsTracker[parseInt(i) + 1]);
              fpsCount[i] = fpsTracker[i] - fpsTracker[parseInt(i) + 1];
            }
            console.log(fpsCount.length);
            if (fpsTracker.length > 8) {
              fpsCount.sort((a, b) => a - b);
              //console.log(fpsCount);
              const q1 = fpsCount[Math.floor((fpsCount.length / 4))];
              const q3 = fpsCount[Math.ceil((fpsCount.length * 0.75))];
              const iqrTimes15 = (q3 - q1) * 1.5;
              const maxValue = q3 + iqrTimes15;
              const minValue = q1 - iqrTimes15;
              //console.log(q1, q3, iqrTimes15, minValue, maxValue);
              fpsCount = fpsCount.filter(x => x <= maxValue && x >= minValue);
              console.log(fpsCount.length);
            }
            fps = Math.round(1000 / (fpsCount.reduce((a, b) => a + b) / fpsTracker.length));
          }
          else fps = fpsTracker.length;
          //console.log(fps);*/
          fpsDisplay.style.setProperty("color", fps < 30 ? "red" : fps < 45 ? "orange" : fps < 60 ? "yellow" : fps < 100 ? "limegreen" : "aqua");
          fpsDisplay.innerHTML = "fps: " + fps;
        }, 1000);
      }
    }
    secret[this._key].spinning = true;
  }
  clear () {
    secret[this._key].show = false;
    this._clearApi();
    Shape.refreshAll();
  }
  stop () {
    secret[this._key].spinning = false;
    if (Shape.spinning.length === 0) {
      cancelAnimationFrame(loop);
      clearInterval(slowLoop);
      fpsDisplay.style.setProperty("display", "none");
      fpsTracker = [];
      //slowFps = undefined;
      Shape.refreshAll();
    }
  }
  toFront (refresh = true) {
    Shape.inFront.interfaces.inFront = false;
    Shape.list.splice(Shape.list.indexOf(this), 1);
    Shape.list.push(this);
    this.interfaces.inFront = true;
    secret[this._key].show = true;
    if (refresh) this.refresh();
  }
  toBack () {
    const thisIndex = Shape.list.indexOf(this);
    if (thisIndex === Shape.list.length) this.interfaces.inFront = false;
    Shape.list.splice(thisIndex, 1);
    Shape.list.unshift(this);
    if (thisIndex === Shape.list.length) Shape.inFront.interfaces.inFront = true;
    Shape.refreshAll();
  }
  static get list () {
    return shapes;
  }
  static get visible() {
    return this.list.filter(shape => shape.show);
  }
  static get spinning () {
    return this.list.filter(shape => shape.spinning);
  }
  static get inFront () {
    return this.list[this.list.length - 1];
  }
  static get canvases() {
    return this.list.filter(shape => shape.canvasSafe).map(shape => shape.canvas).filter((e, i, a) => a.indexOf(e) === i);
  }
  static get fps () {
    if (Shape.spinning.length) {
      const now = performance.now();
      fpsTracker.splice(fpsTracker.findIndex(time => now - time > 1000));
      return fpsTracker.length;
    }
  }
  /*static get displayFps () {
    return displayFps;
  }
  static set displayFps (value) {
    if (displayFps !== value) {
      displayFps = value;
      //if (this.spinning.length && !value) Shape.refreshAll();
    }
  }*/
  static showAll () {
    for (let shape of this.list) {
      shape.draw(...shape.rotations);
    }
  }
  static hideAll () {
    for (let shape of this.list) {
      shape.clear();
    }
  }
  static stopAll () {
    for (let shape of this.list) {
      shape.stop();
    }
  }
  static refreshAll (clear = true) {
    if (clear) this.clearCanvas();
    for (let shape of this.list) {
      shape.refresh(!shape.canvasSafe);
    }
    /*if (this.displayFps && slowFps) {
      //for (let canvas of this.canvases) {
        //const ctx = canvas.getContext("2d");
        //const fpsMsg = `fps: ${slowFps}`;
        //const msgWidth = fpsMsg.length * 8;
        /*ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(Shape.inFront.canvas.width - msgWidth, 0, msgWidth, 20);
        ctx.fillStyle = slowFps < 30 ? "red" : slowFps < 45 ? "orange" : slowFps < 60 ? "yellow" : slowFps < 100 ? "limegreen" : "aqua";
        ctx.font = "20px VT323, monospace";
        ctx.textAlign = "right";
        ctx.fillText(fpsMsg, Shape.inFront.canvas.width, 16);
        ctx.restore();*/
        /*fpsDisplay.style.setProperty("color", slowFps < 30 ? "red" : slowFps < 45 ? "orange" : slowFps < 60 ? "yellow" : slowFps < 100 ? "limegreen" : "aqua");
        fpsDisplay.innerHTML = `fps: ${slowFps}`;*/
      //}
    //}
  }
  static shapeAtEvent (event) {
    for (let shape of this.list.map(shape => shape).reverse()) {
      if (!shape.show || !shape.draggable) continue;
      if (pip(mousePosition(event, shape.canvas.getBoundingClientRect()), shape.points)) return shape;
    }
  }
  static clearCanvas () {
    for (let canvas of this.canvases) {
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  static addInterface (propertyName, element, fromElementModifier, toElementModifier, onlyFront = true) {
    this.interfaces.push([propertyName, element, fromElementModifier, toElementModifier, onlyFront]);
    for (let shape of this.list) {
      shape.interfaces.add(propertyName, element, fromElementModifier, toElementModifier, onlyFront);
    }
  }
}
Shape.interfaces = [];
Shape.displayFps = false;
Shape.addInterface("toBack", shapeMenu.sections[0]["Send to Back"]);
Shape.addInterface("clear", shapeMenu.sections[0].Hide);
Shape.addInterface("stop", shapeMenu.sections[0].Stop);
for (let menu of [shapeMenu, canvasMenu]) {
  for (let option of [["Show", "draw"], ["Hide", "clear"], ["Stop", "stop"]]) {
    Shape.addInterface(option[1], menu.sections[+(menu === shapeMenu)][option[0] + " All"], undefined, undefined, false);
  }
}