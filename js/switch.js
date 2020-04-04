const style = document.createElement("link");
style.rel = "stylesheet";
style.href = "/css/switch.css";
document.head.appendChild(style);

for (let element of Array.from(document.getElementsByClassName("switch"))) {
  element.appendChild(document.createElement("div"));
  element.addEventListener("click", () => {
    element.classList.toggle("on");
    element.dispatchEvent(new Event("change"));
    element.dispatchEvent(new Event("input"));
  });
  Object.defineProperty(element, "value", {
    get: function () {
      return element.classList.contains("on");
    }
  });
}