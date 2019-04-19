//jshint esversion:6
let resizeFun = () => {
  document.getElementById("content").style.width = window.innerWidth + "px";
  document.getElementById("content").style.height = (window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px";
};
let loadFun = () => {
  document.getElementById("content").style.margin = "0px";
  document.getElementById("Capa_1").addEventListener("click", resizeFun);
  resizeFun();
}
window.addEventListener("resize", resizeFun);
if (document.readyState === "complete") loadFun();
else window.addEventListener("load", loadFun);