//jshint esversion:6
const loadFun = () => {
  document.getElementById("Capa_1").onclick();
  document.getElementById("switchSpan").style.display = "none";
  document.getElementById("Capa_1").addEventListener("click", resizeFun);
  if (window.themeReady) window.theme.mode = "light";
  else window.addEventListener("themeReady", () => {window.theme.mode = "light";});
  resizeFun();
};
const resizeFun = () => {
  document.getElementById("content").style.width = window.innerWidth + "px";
  document.getElementById("content").style.height = (window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px";
};
if (document.readyState === "complete") loadFun();
else window.addEventListener("load", loadFun);
window.addEventListener("resize", resizeFun);