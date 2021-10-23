//jshint esversion:6
const loadFunc = () => {
  document.getElementById("Capa_1").onclick();
  /*document.getElementById("switchSpan").style.display = "none";
  if (window.themeReady) window.theme.mode = "light";
  else window.addEventListener("themeReady", () => {window.theme.mode = "light";});*/
};
if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);
//let defaultColor = "#ff0000"
var color = "#ff0000";
var rgbAddColor;
var fill = false;
var memory = [];
var drawHistory = [];
var future = [];
var key = {};
let undo = new Event("undo");
let redo = new Event("redo");
let prev;
var init = () => {
  let defaultColor = "#ff0000";// Eventually make this determined by the theme
  window.color = defaultColor;
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  let bc = document.getElementById("bg");
  let bctx = bc.getContext("2d");
  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;
  let ss = Math.max(...[Math.min(...[Math.floor((window.innerWidth - 500) / width), Math.floor((window.innerHeight - 200) / height), 20]), 5]);
  let cp = () => c.getBoundingClientRect();
  document.documentElement.style.setProperty("--ss", ss + "px");
  //let previous = {x: undefined, y: undefined};
  c.width = width * ss;
  c.height = height * ss;
  bc.width = width * ss;
  bc.height = height * ss;
  window.clear = () => {
    //console.log("this ran");
    ctx.clearRect(0, 0, width * ss, height * ss);
    for (let x = 0; x < width; x++) {
      memory[x] = [];
    }
    drawHistory = [JSON.parse(JSON.stringify(memory))];
  };
  for (let e of [...document.querySelectorAll("#pickers .container")]) {
    e.style.display = "none";
  }
  document.getElementById(document.getElementById("colorMethod").value.toLowerCase()).style.display = "inline-block";
  let mousePosition = event => {
    let x = Math.floor((event.clientX - cp().left - scrollX) / ss);
    let y = Math.floor((event.clientY - cp().top - scrollY) / ss);
    return {x: x, y: y};
  };
  let render = (fun, cv) => {
    if (typeof cv === "undefined") cv = ctx;
    for (let y = 0; y < c.clientHeight / ss; y++) {
      for (let x = 0; x < c.clientWidth / ss; x++) {
        fun(x, y);
        cv.fillRect(x * ss, y * ss, ss, ss);
        //console.log(cv.globalAlpha);
        cv.globalAlpha = 1;
      }
    }
  };
  render((x, y) => {
    /*if ((x + y) % 2 === 0) bctx.fillStyle = "#d0d0d0";
    else bctx.fillStyle = "#eeeeee";*/
    bctx.fillStyle = ((x + y) % 2 === 0) ? "#d0d0d0" : "#eeeeee";
  }, bctx);
  clear();
  let draw = event => {
    if (mousedown) {
      let {x, y} = mousePosition(event);
      if (/^#[a-f\d]{6}$/i.test(color)) {
        memory[x][y] = color;
        ctx.fillStyle = color;
        ctx.fillRect(x * ss, y * ss, ss, ss);
      }
      else {
        delete memory[x][y];
        ctx.clearRect(x * ss, y * ss, ss, ss);
      }
      future = [];
    }
    return mousedown;
  };
  let syncColor = (event, element) => {
    document.getElementById("rgb").removeAttribute("data-err");
    let c = event.target.value;
    document.getElementById(element).value = c;
    syncColorButton();
  };
  let syncColorButton = () => {
    let add = document.getElementById("rgbAdd");
    rgbAddColor = "#" +
      parseInt(document.getElementById("rs").value).toString(16).padStart(2, "0") +
      parseInt(document.getElementById("gs").value).toString(16).padStart(2, "0") +
      parseInt(document.getElementById("bs").value).toString(16).padStart(2, "0");
    add.style.setProperty("color", $color.invert(rgbAddColor));
    add.style.setProperty("background-color", rgbAddColor);
    document.getElementById("storeRgbAdd").value = rgbAddColor;
  };
  let syncColorHSL = (event, element) => {
    document.getElementById("hsl").removeAttribute("data-err");
    document.getElementById(element).value = event.target.value;
    let h = $color.HSLtoHEX(
      document.getElementById("ht").value,
      100,
      50
    );
    //console.log(h);
    if (/^h/.test(element)) {
      document.getElementById("s-key").style.setProperty("background-image", `linear-gradient(${h}, #888888)`);
      document.getElementById("l-key").style.setProperty("background-image", `linear-gradient(#ffffff, ${h}, #000000)`);
    }
    syncColorButtonHSL();
  };
  let syncColorButtonHSL = () => {
    let add = document.getElementById("hslAdd");
    hslAddColor = $color.HSLtoHEX(
      document.getElementById("ht").value,
      document.getElementById("st").value,
      document.getElementById("lt").value
    );
    let h = $color.HSLtoHEX(
      document.getElementById("ht").value,
      100,
      50
    );
    add.style.setProperty("color", $color.invert(hslAddColor));
    add.style.setProperty("background-color", hslAddColor);
    /*document.getElementById("h").style.setProperty("background-color", h + "40");
    document.getElementById("s").style.setProperty("background-color", h + "40");
    document.getElementById("l").style.setProperty("background-color", h + "40");*/
    document.getElementById("storeHslAdd").value = hslAddColor;
  };
  syncColorButton();
  syncColorButtonHSL();
  let fillFun = (x, y) => {
    try {
      let thisCol = memory[x][y];
      if (/^#[a-f\d]{6}$/i.test(color) && thisCol !== color) {
        memory[x][y] = color;
        ctx.fillStyle = color;
        ctx.fillRect(x * ss, y * ss, ss, ss);
        if (memory[x - 1] && x - 1 >= 0) if (memory[x - 1][y] === thisCol) fillFun(x - 1, y);
        if (memory[x + 1] && x - 1 < width) if (memory[x + 1][y] === thisCol) fillFun(x + 1, y);
        if (memory[x][y - 1] === thisCol && y - 1 >= 0) fillFun(x, y - 1);
        if (memory[x][y + 1] === thisCol && y + 1 < height) fillFun(x, y + 1);
      }
    }
    catch (err) {
      setTimeout(() => {
        fillFun(x, y);
      }, 1);
    }
  };
  let addColor = e => {
    let thisColor = e.getAttribute("data-color");
    e.style.setProperty("background-color", thisColor);
    if ($color.isLight(thisColor, "intensityM")) e.style.setProperty("border-color", "#000000");
    else e.style.setProperty("border-color", "#ffffff");
    let tooltip = document.createElement("div");
    tooltip.classList = "arrowBox left override";
    tooltip.innerHTML = thisColor;
    e.appendChild(tooltip);
    e.addEventListener("click", event => {
      if (/^#[a-f\d]{6}$/i.test(color)) document.querySelector(`[data-color="${color}"]`).classList.remove("active");
      color = event.target.getAttribute("data-color");
      event.target.classList.add("active");
      document.getElementById("erase").classList.remove("on");
    });
  };
  createColor = el => {
    if (!el) el = document.getElementById("hexColor");
    let e = document.querySelector(`#${el.id}:not(:invalid)`);
    if (e) {
      /*let thisColor;
      if (/^#/.test(e.value)) thisColor = e.value;
      else thisColor = "#" + e.value;*/
      let thisColor = e.value;
      if (!/^#/.test(thisColor)) thisColor = "#" + thisColor;
      if (!document.querySelector(`[data-color="${thisColor}"]`)) {
        let newColor = thisColor;
        let n = document.createElement("div");
        n.setAttribute("data-color", newColor);
        document.getElementById("colors").appendChild(n);
        addColor(n);
        n.dispatchEvent(new Event("click"));
      }
    }
  };
  let save = () => {
    document.getElementById("download").href = c.toDataURL('image/png');
  };
  document.querySelector(`[data-color="${color}"]`).classList.add("active");
  for (let e of document.querySelectorAll("[data-color]")) {
    addColor(e);
  }
  let mouseDetect = event => {
    if (event.button === 0) mousedown = true;
    if (event.target.closest("#canvas, #hoverShade")) {
      if (fill) {
        let {x, y} = mousePosition(event);
        fillFun(x, y);
      }
      else draw(event);
    }
  };
  let line = (s, e) => {
    // FIXME: This has a MAJOR error. The line is drawn to the canvas, but not to the memory array

    let start = {
      x: s.clientX - cp().left - scrollX,
      y: s.clientY - cp().top - scrollY
    };
    let end = {
      x: (e.clientX - cp().left - scrollX),
      y: (e.clientY - cp().top - scrollY)
    };
    ctx.fillStyle = color;
    let deltaX = (end.x - start.x);
    let deltaY = (end.y - start.y);
    let m = deltaY / deltaX;
    
    if (Math.abs(m) === Infinity) {
      for (let y = Math.min(...[start.y, end.y]); y < Math.max(...[start.y, end.y]); y++) {
        let cords = { x: Math.floor(start.x / ss) * ss, y: Math.floor(y / ss) * ss };
        if (color === "clear") ctx.clearRect(cords.x, cords.y, ss, ss);
        else ctx.fillRect(cords.x, cords.y, ss, ss);
      }
    }
    else if (Math.abs(m) > 1) {
      for (let y = Math.min(...[start.y, end.y]); y < Math.max(...[start.y, end.y]); y++) {
        let cords = { x: Math.floor((((start.y - y) - (m * start.x)) / -m) / ss) * ss, y: Math.floor(y / ss) * ss };
        if (color === "clear") ctx.clearRect(cords.x, cords.y, ss, ss);
        else ctx.fillRect(cords.x, cords.y, ss, ss);
      }
    }
    else {      
      for (let x = Math.min(...[start.x, end.x]); x < Math.max(...[start.x, end.x]); x++) {
        let cords = { x: Math.floor(x / ss) * ss, y: Math.floor(((m * (start.x - x)) - start.y) / -ss) * ss };
        if (color === "clear") ctx.clearRect(cords.x, cords.y, ss, ss);
        else ctx.fillRect(cords.x, cords.y, ss, ss);
      }
    }
    prev = event;
  };
  let mousedown;
  document.body.addEventListener("keydown", event => {
    key[event.key] = true;
    /*if (key.Control && key.z) {
      c.dispatchEvent(undo);
    }
    if (key.Control && key.y) {
      c.dispatchEvent(redo);
    }*/
    /*if (key.Control && key.s) {
      save();
    }*/
  });
  document.body.addEventListener("keyup", event => {
    key[event.key] = false;
  });
  document.body/*c*/.addEventListener("mousemove", event => {
    let e = document.getElementById("hoverShade");
    if (event.target.closest("#canvas, #hoverShade")) {
      e.style.setProperty("display", "initial");
      let {x, y} = mousePosition(event);
      let cpl = cp();
      e.style.setProperty("left", ((x * ss) + cpl.left) + "px");
      e.style.setProperty("top", ((y * ss) + cpl.top) + "px");
    }
    else e.style.setProperty("display", "none");
  });
  c.addEventListener("mousedown", event => {
    mouseDetect(event);
    if (event.button === 0) prev = event;
  });
  document.getElementById("hoverShade").addEventListener("mousedown", event => {
    mouseDetect(event);
    prev = event;
  });
  document.body.addEventListener("mouseup", event => {
    if (event.button === 0) mousedown = false;
    drawHistory.unshift(JSON.parse(JSON.stringify(memory)));
  });
  c.addEventListener("mouseenter", () => {
    if (!fill) draw(event);
  });
  c.addEventListener("mousemove", event => {
    if (!fill) draw(event);
    if (mousedown) {
      /*new Promise((resolve, reject) => {
        line(prev, event);
      })
      .then(() => {
        prev = event;
        console.log("this ran");
      });*/
      line(prev, event);
    }
  });
  c.addEventListener("undo", () => {
    if (drawHistory[1]) memory = drawHistory[1];
    render((x, y) => {
      if (drawHistory[1][x][y]) ctx.fillStyle = drawHistory[1][x][y];
      else {
        ctx.clearRect(x * ss, y * ss, ss, ss);
        ctx.globalAlpha = 0;
      }
      //console.log(drawHistory[1][x][y]);
    });
    if (drawHistory[0]) future.unshift(drawHistory.shift());
    //console.log(drawHistory);
  });
  c.addEventListener("redo", () => {
    if (future[0][x][y]) memory = future[0];
    render((x, y) => {
      if (future[0]) ctx.fillStyle = future[0][x][y];
      else if ((x + y) % 2 === 0) ctx.fillStyle = "#d0d0d0";
      else ctx.fillStyle = "#eeeeee";
    });
    drawHistory.unshift(future.shift());
  });
  c.addEventListener("clear", () => {
    clear();
  });
  c.addEventListener("new", () => {
   location.assign("?ask=true");
  });
  /*document.getElementById("hexColor").addEventListener("change", event => {
    let e = event.target;
    if (/[a-f\d]/i.test(e.value)) e.parentNode.setAttribute("data-err", "Numbers 0-9 or letters a-f only");
  });*/
  document.getElementById("hexColor").addEventListener("input", event => {
    let el = event.target;
    if (!/^[a-f\d]{6}$/i.test(el.value)) {
      //console.log("This ran");
      el.style.removeProperty("color");
      el.style.removeProperty("background-color");
      if (!/^[a-f\d]*$/i.test(el.value)) el.parentNode.setAttribute("data-err", "Numbers 0-9 or letters a-f only");
      else if (!/^.{6}$/.test(el.value)) el.parentNode.setAttribute("data-err", "Must be exactally 6 characters");
    }
    else if (document.querySelector(`[data-color="#${el.value}"]`)) el.parentNode.setAttribute("data-err", "That color alredy exists");
    else {
      //console.log("this ran");
      el.parentNode.removeAttribute("data-err");
      el.style.setProperty("color", $color.invert("#" + el.value));
      el.style.setProperty("background-color", "#" + el.value);
    }
  });
  document.getElementById("hexColor").addEventListener("input", event => {
    if (!/^[a-f\d]{6}$/.test(event.target.value)) event.target.error = "Invalid hex code";
    else event.target.error = "";
  });
  document.getElementById("hexColor").addEventListener("keyup", event => {
    if (event.keyCode === 13) {
      createColor();
    }
  });
  document.getElementById("hexColor").addEventListener("change", event => {
    createColor();
  });
  document.getElementById("rt").addEventListener("input", event => {
    syncColor(event, "rs");
  });
  document.getElementById("rs").addEventListener("input", event => {
    syncColor(event, "rt");
  });
  document.getElementById("gt").addEventListener("input", event => {
    syncColor(event, "gs");
  });
  document.getElementById("gs").addEventListener("input", event => {
    syncColor(event, "gt");
  });
  document.getElementById("bt").addEventListener("input", event => {
    syncColor(event, "bs");
  });
  document.getElementById("bs").addEventListener("input", event => {
    syncColor(event, "bt");
  });
  document.getElementById("rgbAdd").addEventListener("click", () => {
    if (document.querySelector(`[data-color="${document.getElementById("storeRgbAdd").value}"]`)) {
      //console.log("this ran");
      document.getElementById("rgb").setAttribute("data-err", "That color already exists");
    }
    else {
      createColor(document.getElementById("storeRgbAdd"));
    }
  });
  document.getElementById("ht").addEventListener("input", event => {
    syncColorHSL(event, "hs");
  });
  document.getElementById("hs").addEventListener("input", event => {
    syncColorHSL(event, "ht");
  });
  document.getElementById("st").addEventListener("input", event => {
    syncColorHSL(event, "ss");
  });
  document.getElementById("ss").addEventListener("input", event => {
    syncColorHSL(event, "st");
  });
  document.getElementById("lt").addEventListener("input", event => {
    syncColorHSL(event, "ls");
  });
  document.getElementById("ls").addEventListener("input", event => {
    syncColorHSL(event, "lt");
  });
  document.getElementById("hslAdd").addEventListener("click", () => {
    if (document.querySelector(`[data-color="${document.getElementById("storeHslAdd").value}"]`)) {
      //console.log("this ran");
      document.getElementById("hsl").setAttribute("data-err", "That color already exists");
    }
    else {
      createColor(document.getElementById("storeHslAdd"));
    }
  });
  document.getElementById("osColorPick").addEventListener("change", event => {
    if (document.querySelector(`[data-color="${event.target.value}"]`)) {
      event.target.parentNode.setAttribute("data-err", "That color already exists");
    } 
    createColor(event.target);
  });
  document.getElementById("colorMethod").addEventListener("change", event => {
    e = event.target;
    //console.log(e.value.toLowerCase());
    document.querySelector("#pickers [style='display: inline-block;']").style.display = "none";
    document.getElementById(e.value.toLowerCase()).style.display = "inline-block";
  });
  document.getElementById("erase").addEventListener("click", () => {
    if (/^#[a-f\d]{6}$/i.test(color)) document.querySelector(`[data-color="${color}"]`).classList.remove("active");
    color = "clear";
    event.target.classList.add("on");
    if (document.querySelector("#fill.on")) document.querySelector("#fill.on").dispatchEvent(new Event("click"));
  });
  document.getElementById("fill").addEventListener("click", event => {
    //console.log("Fill toggled");
    fill = !fill;
    if (fill) event.target.classList.add("on");
    else event.target.classList.remove("on");
    if (fill && document.querySelector("#erase.on")) document.querySelector(`[data-color = "${defaultColor}"]`).dispatchEvent(new Event("click"));// This may throw errors. Keep it at the END!
  });
  document.getElementById("clear").addEventListener("click", () => {
    modal.open("#clearConfirm");
  });
  document.getElementById("new").addEventListener("click", () => {
    modal.open("#newConfirm");
  });
  document.getElementById("download").addEventListener("click", () => {
    save();
  });
};
document.addEventListener("modalsReady", () => {
  document.getElementById("width").setAttribute("max", Math.floor((window.innerWidth - 500) / 5));
  document.getElementById("height").setAttribute("max", Math.floor((window.innerHeight - 200) / 5));
  if (new URLSearchParams(location.search).get("ask") === "true") {
    modal.open("#initial");
  }
  else {
    init();
  }
});