import { Shape } from "/lib/shapes.js";
import pip from "/js/point-in-polygon.js";
window.Shape = Shape;
let held, selected, xOffset, yOffset, loop;
let deleted = 0;
let shapes = [];
let spinning = [];
let axes = ["x", "y", "z"];
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let bcr = () => c.getBoundingClientRect();
let mousePosition = event => {
  let localbcr = bcr(); 
  let x = ((event.clientX || event.changedTouches[0].clientX) - localbcr.left - scrollX);
  let y = ((event.clientY || event.changedTouches[0].clientY) - localbcr.top - scrollY);
  return [x, y];
};
let redraw = () => {
  ctx.clearRect(0, 0, 300, 300);
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (shapes[i].show) shapes[i].draw(...shapes[i].rotations);
  }
};
window.select = id => {
  let old = document.querySelector(".menuTab.selected");
  if (old) old.classList.remove("selected");
  document.getElementById("tab" + id).classList.add("selected");
  selected = shapes.find(shape => shape.id === id);
  if (selected.show) selected.draw(...selected.rotations);
  shapes.unshift(shapes.splice(shapes.indexOf(selected), 1)[0]);
  document.getElementById("x").value = selected.x;
  document.getElementById("y").value = selected.y;
  document.getElementById("widthT").value = document.getElementById("widthS").value = selected.width;
  for (let axis of axes) {
    document.getElementById(axis + "-axis-rotation").value = document.getElementById(axis + "-axis-rotation-slider").value = Math.round(selected.show ? selected.rotations[axes.indexOf(axis)] : selected.saveRotations[axes.indexOf(axis)]);
    document.getElementById(axis + "-deg-radio").checked = true;
    document.getElementById(axis + "-axis-rotation").max = document.getElementById(axis + "-axis-rotation-slider").max = 360;
    document.getElementById(axis + "-axis-rotation").step = document.getElementById(axis + "-axis-rotation-slider").step = 1;
  }
  let showButton = document.getElementById("visibilityToggle");
  if (selected.show === (showButton.value === "Show")) showButton.dispatchEvent(new Event("click"));
  document.getElementById("hexColor").value = selected.color.replace("#", "");
  document.getElementById("hexColor").dispatchEvent(new Event("input"));
  document.getElementById("spin-axis").value = selected.axis || "x";
  document.getElementById("rpm").value = (selected.dpms * 60000 / 360) || 20;
  let spinButton = document.getElementById("spin");
  if (spinning.includes(selected) === (spinButton.value === "GO!")) spinButton.dispatchEvent(new Event("click"));
};
window.newShape = (sides, config) => {
  let shape = new Shape(sides, config);
  shape.draw();
  shape.id = shapes.length + deleted;
  shapes.unshift(shape);
  selected = shape;
  let old = document.querySelector(".menuTab.selected");
  if (old) old.classList.remove("selected");
  let tab = document.createElement("div");
  tab.id = "tab" + shape.id;
  tab.classList = "menuTab selected";
  tab.onclick = () => { select(shape.id); };
  document.getElementById("menuTabs").insertBefore(tab, document.getElementById("newShape"));
  let icon = document.createElement("canvas");
  icon.id = "icon" + shape.id;
  icon.height = 20;
  icon.width = 20;
  tab.appendChild(icon);
  selected.icon = new Shape(shape.sides, {canvas: icon, width: 20, center: "vertical", color: shape.color});
  shape.icon.draw();
};
let syncColorHSL = (event, element) => {
  document.getElementById(element).value = event.target.value;
  if (/^h/.test(element)) {
    let h = $color.HSLtoHEX(
      document.getElementById("ht").value,
      100,
      50
    );
    document.getElementById("s-key").style.setProperty("background-image", `linear-gradient(${h}, #888888)`);
    document.getElementById("l-key").style.setProperty("background-image", `linear-gradient(#ffffff, ${h}, #000000)`);
  }
  let hex = $color.HSLtoHEX(
    document.getElementById("ht").value,
    document.getElementById("st").value,
    document.getElementById("lt").value
  );
  document.getElementById("hexColor").value = hex.replace("#", "");
  selected.color = hex;
  selected.icon.color = hex;
};
let spin = () => {
  loop = setInterval(() => {
    let now = performance.now();
    spinning.forEach(shape => {
      shape.rotationTemplate.push(shape.dpms * (now - shape.start));
      shape.rotations = [...shape.rotationTemplate];
      if (shape === selected) document.getElementById(selected.axis + "-axis-rotation").value = Math.round(shape.rotationTemplate.pop() % 360);
      else shape.rotationTemplate.pop();
    });
    redraw();
  }, 1000 / 144);
};
let init = () => {
  newShape(6, {x: 100, y: 105});
  newShape(3, {x: 200, y: 221, color: "#ff0000"});
  select(0);
};
let mousedown = e => {
  for (let shape of shapes) {
    if (!shape.show) continue;
    let mousePos = mousePosition(e);
    if (pip(mousePos, shape.points)) {
      select(shape.id);
      selected = held = shapes[0];
      xOffset = held.x - mousePos[0];
      yOffset = held.y - mousePos[1];
      held.draw(...held.rotations);
      break;
    }
  }
};
let mouseup = () => {
  held = undefined;
};
let mousemove = e => {
  let mousePos = mousePosition(e);
  if (held) {
    held.x = mousePos[0] + xOffset;
    held.y = mousePos[1] + yOffset;
    document.getElementById("x").value = held.x;
    document.getElementById("y").value = held.y;
    redraw();
  }
  for (let shape of shapes) {
    if (!shape.show) continue;
    if (pip(mousePos, shape.points)) {
      c.classList.add("move");
      break;
    }
    else c.classList.remove("move");
  }
};
c.addEventListener("mousedown", mousedown);
c.addEventListener("touchstart", mousedown);
document.addEventListener("mouseup", mouseup);
document.addEventListener("touchend", mouseup);
c.addEventListener("mousemove", mousemove);
c.addEventListener("touchmove", mousemove);
document.getElementById("newShape").addEventListener("click", () => {
  modal.open("#shapeCreationMenu");
});
document.getElementById("x").addEventListener("input", event => {
  if (event.target.validity.valid) {
    let x = parseFloat(event.target.value);
    selected.x = x;
    redraw();
  }
});
document.getElementById("y").addEventListener("input", event => {
  if (event.target.validity.valid) {
    let y = parseFloat(event.target.value);
    selected.y = y;
    redraw();
  }
});
document.getElementById("widthT").addEventListener("input", event => {
  if (event.target.validity.valid) {
    let width = parseFloat(event.target.value);
    document.getElementById("widthS").value = width;
    selected.width = width;
    redraw();
  }
});
document.getElementById("widthS").addEventListener("input", event => {
  let width = event.target.value;
  document.getElementById("widthT").value = width;
  selected.width = width;
  redraw();
});
for (let axis of axes) {
  document.getElementById(axis + "-axis-rotation").addEventListener("input", event => {
    if (event.target.validity.valid) {
      let value = event.target.value;
      let rotations = selected.rotations;
      document.getElementById(axis + "-axis-rotation-slider").value = value;
      rotations[axes.indexOf(axis)] = value + document.getRadio(axis + "-axis-rotation-unit").value;
      selected.draw(...rotations);
      redraw();
    }
  });
  [...document.getElementsByName(axis + "-axis-rotation-unit")].forEach(e => e.addEventListener("input", () => {
    let input = document.getElementById(axis + "-axis-rotation");
    let slider = document.getElementById(axis + "-axis-rotation-slider");
    let rotations = selected.rotations;
    if (selected.show && input.validity.valid) {
      if (e.value === "deg") {
        input.step = slider.step = 1;
        input.max = slider.max = 360;
        input.value = slider.value = Math.round(parseFloat(input.value) * 180 / Math.PI);
      }
      else {
        input.step = slider.step = 0.0001;
        input.max = slider.max = 2 * Math.PI;
        input.value = slider.value = Math.round(parseFloat(input.value) * Math.PI * 10000 / 180) / 10000;
      }
      rotations[axes.indexOf(axis)] = input.value + e.value;
      selected.draw(...rotations);
      redraw();
    }
  }));
  document.getElementById(axis + "-axis-rotation-slider").addEventListener("input", event => {
    let value = event.target.value;
    let rotations = selected.rotations;
    document.getElementById(axis + "-axis-rotation").value = value;
    rotations[axes.indexOf(axis)] = value + document.getRadio(axis + "-axis-rotation-unit").value;
    selected.draw(...rotations);
    redraw();
  });
}
document.getElementById("delete").addEventListener("click", () => {
  selected.clear();
  document.getElementById("tab" + selected.id).delete();
  deleted++;
  shapes.shift();
  if (shapes.length > 0) {
    select(shapes[0].id);
    redraw();
  }
});
document.getElementById("visibilityToggle").addEventListener("click", event => {
  let e = event.target;
  if (e.value === "Hide") {
    e.value = "Show";
    if (spinning.includes(selected)) {
      document.getElementById("spin").dispatchEvent(new Event("click"));
    }
    if (selected.show) selected.saveRotations = selected.rotations;
    selected.clear();
    document.querySelectorAll("#menu input:not(#delete):not(#visibilityToggle)").forEach(e => { e.disabled = true; });
    for (let e of ["mainMenuOptions", "colorMenu", "spinMenu", `icon${selected.id}`]) {
      document.getElementById(e).style.opacity = 0.5;
    }
    redraw();
  }
  else {
    e.value = "Hide";
    if (!selected.show) selected.draw(...selected.saveRotations);
    document.querySelectorAll("#menu input").forEach(e => { e.disabled = false; });
    for (let e of ["mainMenuOptions", "colorMenu", "spinMenu", `icon${selected.id}`]) {
      document.getElementById(e).style.opacity = 1;
    }
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
document.getElementById("hexColor").addEventListener("input", event => {
  let hex = "#" + event.target.value;
  if (hex.length === 7) {
    selected.color = hex;
    selected.icon.color = hex;
    let { h, s, l } = $color.HEXtoHSL(hex);
    h = Math.round(h);
    s = Math.round(s);
    l = Math.round(l);
    document.getElementById("ht").value = h;
    document.getElementById("hs").value = h;
    document.getElementById("st").value = s;
    document.getElementById("ss").value = s;
    document.getElementById("lt").value = l;
    document.getElementById("ls").value = l;
    let hSync = $color.HSLtoHEX(
      document.getElementById("ht").value,
      100,
      50
    );
    document.getElementById("s-key").style.setProperty("background-image", `linear-gradient(${hSync}, #888888)`);
    document.getElementById("l-key").style.setProperty("background-image", `linear-gradient(#ffffff, ${hSync}, #000000)`);
  }
});
document.getElementById("spin").addEventListener("click", event => {
  let e = event.target;
  if (e.value === "GO!") {
    e.value = "STOP!";
    e.className = "no";
    if (!spinning.includes(selected)) {
      selected.axis = document.getElementById("spin-axis").value;
      switch (selected.axis) {
        case "x":
          selected.rotationTemplate = [];
          break;
        case "y":
          selected.rotationTemplate = [0];
          break;
        case "z":
          selected.rotationTemplate = [0, 0];
          break;
      }
      for (let axis of axes) {
        document.getElementById(axis + "-axis-rotation").value = 0;
        document.getElementById(axis + "-axis-rotation-slider").value = 0;
      }
      let degRadio = document.getElementById(selected.axis + "-deg-radio");
      degRadio.checked = true;
      degRadio.dispatchEvent(new Event("input"));
      selected.dpms = document.getElementById("rpm").value * 360 / 60000;
      selected.start = performance.now();
      spinning.push(selected);
      if (spinning.length === 1) spin();
    }
    document.querySelectorAll("#rotations input, #spinMenuNoButton input, #spin-axis").forEach(e => { e.disabled = true; });
    for (let e of ["rotations", "spinMenuNoButton"]) {
      document.getElementById(e).style.opacity = 0.5;
    }
  }
  else {
    e.value = "GO!";
    e.className = "yes";
    if (spinning.includes(selected)) {
      spinning.splice(spinning.indexOf(selected), 1);
      if (spinning.length === 0) clearInterval(loop);
      document.getElementById(selected.axis + "-axis-rotation-slider").value = document.getElementById(selected.axis + "-axis-rotation").value;
    }
    document.querySelectorAll("#rotations input, #spinMenuNoButton input, #spin-axis").forEach(e => { e.disabled = false; });
    for (let e of ["rotations", "spinMenuNoButton"]) {
      document.getElementById(e).style.opacity = 1;
    }
  }
});
if (window.themeReady) init();
else window.addEventListener("themeReady", init);
hljs.initHighlightingOnLoad();