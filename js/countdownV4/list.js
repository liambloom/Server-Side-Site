const grid = document.getElementById("grid");
const rows = document.getElementById("rows");
const presets = document.getElementById("presets-list");
grid.addEventListener("click", () => {
  presets.classList.replace("list", "grid");
  grid.classList.add("active");
  rows.classList.remove("active");
});
rows.addEventListener("click", () => {
  presets.classList.replace("grid", "list");
  rows.classList.add("active");
  grid.classList.remove("active");
});