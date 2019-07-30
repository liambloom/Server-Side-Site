//jshint esversion:6
document.getElementById("Capa_1").style.display = "none";
let c = document.getElementById("main");
let ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = (window.innerHeight - document.getElementsByTagName("header")[0].clientHeight) - 1;
