const grid = document.getElementById("grid");
const rows = document.getElementById("rows");
const presets = document.getElementById("presets-list");
grid.addEventListener("click", () => {
  presets.classList.replace("list", "grid");
  grid.classList.add("active");
  rows.classList.remove("active");
  if (localStorage.getItem("cookie")) localStorage.setItem("countdownLayout", "grid");
});
rows.addEventListener("click", () => {
  presets.classList.replace("grid", "list");
  rows.classList.add("active");
  grid.classList.remove("active");
  if (localStorage.getItem("cookie")) localStorage.setItem("countdownLayout", "rows");
});
if (localStorage.getItem("countdownLayout") === "grid") grid.dispatchEvent(new Event("click"));
else if (localStorage.getItem("countdownLayout") === "list") grid.dispatchEvent(new Event("click"));