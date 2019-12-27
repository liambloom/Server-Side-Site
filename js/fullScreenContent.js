//jshint esversion:6
let resizeFun = () => {
  document.getElementsByTagName("main")[0].style.width = window.innerWidth + "px";
  document.getElementsByTagName("main")[0].style.height = (window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) + "px"; // This line of code causes the arrow moving to the right glitch
};
let loadFun = () => {
  document.getElementsByTagName("main")[0].style.margin = "0px";
  document.getElementById("Capa_1").addEventListener("click", resizeFun);
  resizeFun();
}
window.addEventListener("resize", resizeFun);
if (document.readyState === "complete") loadFun();
else window.addEventListener("load", loadFun);