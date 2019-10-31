const heightAdjust = () => {
  console.log(document.getElementsByTagName("header")[0].offsetHeight);
  document.getElementsByTagName("main")[0].style.height = window.innerHeight - document.getElementsByTagName("header")[0].offsetHeight + "px";
};
const init = () => {
  document.getElementById("Capa_1").addEventListener("click", heightAdjust);
  heightAdjust();
};
hljs.initHighlightingOnLoad();
if (window.themeReady) init();
else window.addEventListener("themeReady", init);