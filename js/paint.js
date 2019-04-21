//jshint esversion:6
const loadFunc = () => {
  document.getElementById("Capa_1").onclick();
  /*document.getElementById("switchSpan").style.display = "none";
  if (window.themeReady) window.theme.mode = "light";
  else window.addEventListener("themeReady", () => {window.theme.mode = "light";});*/
};
if (document.readyState === "complete") loadFunc();
else window.addEventListener("load", loadFunc);
var color = "#ff0000";
var memory = [];
var drawHistory = [];
var future = [];
var key = {};
let undo = new Event("undo");
let redo = new Event("redo");
var init = () => {
  let c = document.getElementById("canvas");
  let ctx = c.getContext("2d");
  let bc = document.getElementById("bg");
  let bctx = bc.getContext("2d");
  let width = document.getElementById("width").value;
  let height = document.getElementById("height").value;
  let ss = Math.max(...[Math.min(...[Math.floor((window.innerWidth - 500) / width), Math.floor((window.innerHeight - 200) / height), 20]), 5]);
  let cp = () => c.getBoundingClientRect();
  document.documentElement.style.setProperty("--ss", ss + "px");
  let previous = {x: undefined, y: undefined};
  for (let x = 0; x < width; x++) {
    memory[x] = [];
  }
  c.width = width * ss;
  c.height = height * ss;
  bc.width = width * ss;
  bc.height = height * ss;
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
  let reset = () => {
    ctx.clearRect(0, 0, width * ss, height * ss);
    drawHistory.unshift(JSON.parse(JSON.stringify(memory)));
  };
  reset();
  let draw = event => {
    if (mousedown) {
      let pos = mousePosition(event);
      if (/^#[a-f\d]{6}$/i.test(color)) {
        memory[pos.x][pos.y] = color;
        ctx.fillStyle = color;
        ctx.fillRect(pos.x * ss, pos.y * ss, ss, ss);
      }
      else {
        memory[pos.x][pos.y] = undefined;
        ctx.clearRect(pos.x * ss, pos.y * ss, ss, ss);
      }
      future = [];
    }
    return mousedown;
  };
  let save = () => {
    document.getElementById("download").href = c.toDataURL('image/png');
  };
  document.querySelector(`[data-color="${color}"]`).classList.add("active");
  for (let e of document.querySelectorAll("[data-color]")) {
    thisColor = e.getAttribute("data-color");
    e.style.setProperty("background-color", thisColor);
    //e.style.setProperty("border-color", $color.invert(thisColor));
    if ($color.isLight(thisColor, "intensityM")) e.style.setProperty("border-color", "#000000");
    else e.style.setProperty("border-color", "#ffffff");
    e.addEventListener("click", event => {
      if (/^#[a-f\d]{6}$/i.test(color)) document.querySelector(`[data-color="${color}"]`).classList.remove("active");
      color = event.target.getAttribute("data-color");
      event.target.classList.add("active");
    });
  }
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
  /*document.body*/c.addEventListener("mousemove", event => {
    let e = document.getElementById("hoverShade");
    if (event.target.closest("#canvas, #hoverShade")) {
      e.style.setProperty("display", "initial");
      let pos = mousePosition(event);
      let cpl = cp();
      //console.log((pos.x * ss) + cpl.left);
      e.style.setProperty("left", ((pos.x * ss) + cpl.left) + "px");
      e.style.setProperty("top", ((pos.y * ss) + cpl.top) + "px");
    }
    else e.style.setProperty("display", "none");
    //console.log(event.target.closest("#canvas, #hoverShade"));
  });
  document.body.addEventListener("mousedown", event => {
    if (event.button === 0) mousedown = true;
    if (event.target.closest("#canvas, #hoverShade")) {
      draw(event);
    }
  });
  document.body.addEventListener("mouseup", event => {
    if (event.button === 0) mousedown = false;
    drawHistory.unshift(JSON.parse(JSON.stringify(memory)));
  });
  c.addEventListener("mousemove", event => {
    draw(event);
  });
  c.addEventListener("undo", () => {
    if (drawHistory[1]) memory = drawHistory[1];
    render((x, y) => {
      if (drawHistory[1][x][y]) ctx.fillStyle = drawHistory[1][x][y];
      else {
        ctx.clearRect(x * ss, y * ss, ss, ss);
        ctx.globalAlpha = 0;
      }
      console.log(drawHistory[1][x][y]);
    });
    if (drawHistory[0]) future.unshift(drawHistory.shift());
    console.log(drawHistory);
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
    ctx.clearRect(0, 0, width * ss, height * ss);
  });
  document.getElementById("erase").addEventListener("click", () => {
    if (/^#[a-f\d]{6}$/i.test(color)) document.querySelector(`[data-color="${color}"]`).classList.remove("active");
    color = "clear";
  });
  document.getElementById("clear").addEventListener("click", () => {
    modal.open("#clearConfirm");
  });
  /*document.getElementById("import").addEventListener("change", event => {
    if (window.confirm("Are you sure you want to replace your current drawing with this one?")) {
      //console.log(event.target.result);
      let reader = new FileReader();
      reader.onload = e => {
        ctx.drawImage(e.target.result, 0, 0);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  });*/
  document.getElementById("download").addEventListener("click", () => {
    save();
  });
};
/*let pre = () => {
  let observer = new MutationObserver((mutationList, observer) => {
    console.log("foo");
    observer.disconnect();
  }, { childList: true });
  //modal.open("#initial");
  observer.observe(document.getElementById("initial"));
};
if (document.readyState === "interactive") pre();
else window.addEventListener("DOMContentLoaded", pre);*/
document.addEventListener("modalsReady", () => {
  modal.open("#initial");
  document.getElementById("width").setAttribute("max", Math.floor((window.innerWidth - 500) / 5));
  document.getElementById("height").setAttribute("max", Math.floor((window.innerHeight - 200) / 5));
});