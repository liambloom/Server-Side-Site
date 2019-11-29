const grid = document.getElementById("grid");
const rows = document.getElementById("rows");
const menus = document.getElementById("list-menus");
grid.addEventListener("click", () => {
  menus.classList.replace("list", "grid");
  grid.classList.add("active");
  rows.classList.remove("active");
  if (localStorage.getItem("cookie")) localStorage.setItem("countdownLayout", "grid");
});
rows.addEventListener("click", () => {
  menus.classList.replace("grid", "list");
  rows.classList.add("active");
  grid.classList.remove("active");
  if (localStorage.getItem("cookie")) localStorage.setItem("countdownLayout", "rows");
});
if (localStorage.getItem("countdownLayout") === "grid") grid.dispatchEvent(new Event("click"));
else if (localStorage.getItem("countdownLayout") === "list") grid.dispatchEvent(new Event("click"));
for (let e of document.getElementById("listTabs").children) {
  e.addEventListener("click", () => {
    for (let el of document.getElementById("listTabs").children) {
      el.classList.remove("selected");
    }
    for (let el of document.getElementsByClassName("list-menu")) {
      el.classList.add("hidden");
    }
    e.classList.add("selected");
    document.getElementById(`${e.id}-list`).classList.remove("hidden");
  });
}