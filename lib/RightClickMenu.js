const deepPrototypeProps = obj => obj === null ? null : Object.assign(Object.getOwnPropertyDescriptors(obj), deepPrototypeProps(Object.getPrototypeOf(obj)));

const menuClass = "right-click-menu-" + Math.floor(Math.random() * 1e+6); // random characters so that it won't interfere with code that imports it.

document.addEventListener("touchend", () => {
  for (let menu of RightClickMenu.list) {
    menu.classList.add("touch");
    if (!menu.contains(event.target))  menu.classList.remove("open");
  }
});
document.addEventListener("mouseup", () => {
  for (let menu of RightClickMenu.list) {
    menu.classList.remove("touch");
    if (!menu.contains(event.target)) menu.classList.remove("open");
  }
});
const style = document.createElement("style");
style.innerHTML = `
.${menuClass} {
  position: fixed;
  background-color: #eeeeee;
  width: 200px;
  padding: 3px 4px;
  border: 1px solid #cccccc;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.6);
  color: black;
  font-family: Verdana;
  font-size: 12px;
  flex-direction: column;
  z-index: 10;
  cursor: default;
}
.${menuClass}:not(.open) {
  display: none;
}
.${menuClass} ::selection {
  background-color: transparent;
}
.${menuClass} > div {
  border-top: 1px solid #cccccc;
  padding: 2px 0px;
}
.${menuClass} > div:first-child {
  border-top: none;
}
.${menuClass} > div > div {
  padding: 2.5px 2.5px 2.5px 10px;
}
.${menuClass}.touch > div > div {
  padding: 12.5px 12.5px 12.5px 20px;
}
.${menuClass} > div > div:hover {
  background-color: lightblue;
}`;
document.head.appendChild(style);

export default class RightClickMenu {
  constructor (structure) {
    const menu = document.createElement("div");
    menu.classList.add(menuClass);
    document.body.appendChild(menu);
    /*const divPropertyDescriptor = deepPrototypeProps(this.element);
    for (let property in divPropertyDescriptor) {
      const propertyDescriptor = divPropertyDescriptor[property];
      for (let fun of ["value", "get", "set"]) {
        if (typeof propertyDescriptor[fun] === "function") propertyDescriptor[fun] = propertyDescriptor[fun].bind(this.element);
      }
      Object.defineProperty(this, property, propertyDescriptor);
    }*/
    menu.sections = [];
    for (let section of structure) {
      menu.sections.push({});
      const sectionDiv = document.createElement("div");
      menu.appendChild(sectionDiv);
      for (let option of section) {
        const optionDiv = document.createElement("div");
        sectionDiv.appendChild(optionDiv);
        optionDiv.innerHTML = option;
        optionDiv.addEventListener("click", () => {
          menu.classList.remove("open");
        });
        menu.sections[menu.sections.length - 1][option] = optionDiv;
      }
    }
    menu.addEventListener("contextmenu", event => {
      event.preventDefault();
      menu.classList.remove("open");
    });
    return menu;
  }
  static get list () {
    return document.getElementsByClassName(menuClass);
  }
}
window.RightClickMenu = RightClickMenu;