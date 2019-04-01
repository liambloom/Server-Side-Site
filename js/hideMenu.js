//jshint esversion:6
if (document.readyState === "complete") {
	//console.log("ran");
	document.getElementById("Capa_1").onclick();
}
else {
	//console.log("set");
	window.addEventListener("load", () => {document.getElementById("Capa_1").onclick()});
}