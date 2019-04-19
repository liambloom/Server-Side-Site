//jshint esversion:6
const loadFun = () => {
  document.getElementById("Capa_1").onclick();
  document.getElementById("switchSpan").style.display = "none";
  if (window.themeReady) window.theme.mode = "light";
  else window.addEventListener("themeReady", () => {window.theme.mode = "light";});
  resizeFun();
};
if (document.readyState === "complete") loadFun();
else window.addEventListener("load", loadFun);