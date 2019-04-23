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
    if ((x + y) % 2 === 0) bctx.fillStyle = "#d0d0d0";
    else bctx.fillStyle = "#eeeeee";
  }, bctx);
  clear();
  let draw = event => {
    if (mousedown) {
      let pos = mousePosition(event);
      if (/^#[a-f\d]{6}$/i.test(color)) {
        memory[pos.x][pos.y] = color;
        ctx.fillStyle = color;
        ctx.fillRect(pos.x * ss, pos.y * ss, ss, ss);
      }
      else {
        delete memory[pos.x][pos.y];
        ctx.clearRect(pos.x * ss, pos.y * ss, ss, ss);
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
  syncColorButton();
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
    if (!el) el = document.getElementById("color")
    let e = document.querySelector(`#${el.id}:not(:invalid)`);
    if (e) {
      let thisColor;
      if (/^#/.test(e.value)) thisColor = e.value;
      else thisColor = "#" + e.value;
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
        let pos = mousePosition(event);
        fillFun(pos.x, pos.y);
      }
      else draw(event);
    }
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
      let pos = mousePosition(event);
      let cpl = cp();
      e.style.setProperty("left", ((pos.x * ss) + cpl.left) + "px");
      e.style.setProperty("top", ((pos.y * ss) + cpl.top) + "px");
    }
    else e.style.setProperty("display", "none");
  });
  c.addEventListener("mousedown", event => {
    mouseDetect(event);
  });
  document.getElementById("hoverShade").addEventListener("mousedown", event => {
    mouseDetect(event);
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
  /*document.getElementById("color").addEventListener("change", event => {
    let e = event.target;
    if (/[a-f\d]/i.test(e.value)) e.parentNode.setAttribute("data-err", "Numbers 0-9 or letters a-f only");
  });*/
  document.getElementById("color").addEventListener("input", event => {
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
  document.getElementById("color").addEventListener("keyup", event => {
    if (event.keyCode === 13) {
      createColor();
    }
  });
  document.getElementById("color").addEventListener("change", event => {
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
      console.log("this ran");
      document.getElementById("rgb").setAttribute("data-err", "That color already exists");
    }
    else {
      createColor(document.getElementById("storeRgbAdd"));
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
  document.getElementById("download").addEventListener("click", () => {
    save();
  });
};
document.addEventListener("modalsReady", () => {
  modal.open("#initial");
  document.getElementById("width").setAttribute("max", Math.floor((window.innerWidth - 500) / 5));
  document.getElementById("height").setAttribute("max", Math.floor((window.innerHeight - 200) / 5));
});