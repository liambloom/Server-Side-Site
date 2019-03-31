//jshint esversion:6
function change() {
	/*var color = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"]
	var colorArray = []
	var i
	var colorFull
	var colorp
	for (i = 0; i < 6; i++) {
		colorp = undefined
		do {
			colorp = color[Math.round(Math.random() * 16)]
		}
		while (colorp == undefined)
		colorArray.push(colorp)
	}
	var colorFull = "#" + colorArray[0] + colorArray[1] + colorArray[2] + colorArray[3] + colorArray[4] + colorArray[5]*/
	let color = "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0");
	let r = parseInt(color.slice(1, 3), 16);
	let g = parseInt(color.slice(3, 5), 16);
	let b = parseInt(color.slice(5, 7), 16);
	inverted = "#" + 
		(255 - r).toString(16).padStart(2, "0") +
		(255 - g).toString(16).padStart(2, "0") +
		(255 - b).toString(16).padStart(2, "0");
	document.body.style.backgroundColor = color;
	document.getElementsByName("ReloadButton")[0].innerHTML = color;
	//document.getElementsByName("ReloadButton")[0].style.background = color;
	root.style.setProperty("--buttonBg", color);
	root.style.setProperty("--buttonFade", inverted);
	root.style.setProperty("--buttonFocus", inverted);
	switch([r, g, b].sort((a, b) => b - a).toString()) {//Only tertiary colors. Other colors are super unlikely and much harder to code for.
		case `${r},${g},${b}`: 
			window.themeChange("orange"); 
			break;
		case `${g},${r},${b}`: 
			window.themeChange("lime"); 
			break;
		case `${g},${b},${r}`:
			window.themeChange("mint");
			break;
		case `${b},${g},${r}`:
			window.themeChange("teal");
			break;
		case `${b},${r},${g}`:
			window.themeChange("purple");
			break;
		case `${r},${b},${g}`:
			window.themeChange("pink");
			break;
		default: 
			console.error("Something Broke!");
			break;
	}
}
/*if (document.readyState === "complete") change();
else window.addEventListener("load", change);*/