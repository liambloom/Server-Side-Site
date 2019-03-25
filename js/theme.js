//jshint esversion:6
const defaultTheme = "teal";
window.root = document.documentElement;//imposible to not get this first
window.onresize = () => {
	//console.log(-document.getElementsByTagName("h1")[0].clientHeight);
	root.style.setProperty("--size", -document.getElementsByTagName("h1")[0].clientHeight - 5 + "px");
	root.style.setProperty("--angle", Math.atan(document.getElementsByTagName("header")[0].clientHeight/window.innerWidth) + "rad");
};
window.onload = () => {
	window.onresize();

	const req = new XMLHttpRequest();
	req.open("GET", "/json/themes.json");
	req.send();

	req.onload = () => {
		if (req.status === 200) {
			window.themes = JSON.parse(req.response);//so cool how easy it is to define a var in the window
			themeChange(defaultTheme);
			//const menuShell = document.createElement("li");
			const colorMenu = document.createElement("select");
			colorMenu.setAttribute("onclick", "window.themeChange(this.value);window.coustomThemeDefaults()");
			for (let i in themes) {
				//let optionValue = themes[i];
				let optionElement = document.createElement("option");
				optionElement.innerHTML = i.charAt(0).toUpperCase() + i.slice(1);
				if (i === defaultTheme) optionElement.setAttribute("selected", "selected");
				colorMenu.appendChild(optionElement);
			}
			//menuShell.appendChild(colorMenu);
			document.getElementById("picker").appendChild(colorMenu);
			rootstyle = getComputedStyle(root);
			//console.log(rootstyle.getPropertyValue("--light"));
			window.coustomThemeDefaults = () => {
				document.getElementById("light").value = rootstyle.getPropertyValue("--light");
				document.getElementById("dark").value = rootstyle.getPropertyValue("--dark");
				document.getElementById("text").value = rootstyle.getPropertyValue("--headTxt");
				let bgcolorArray = document.body.style.backgroundColor.match(/\d+/g);
				let bgcolorString = "#";
				for (let i = 0; i < 3; i++) {
					bgcolorString += parseInt(bgcolorArray[i]).toString(16);
				}
				document.getElementById("bgcolor").value = bgcolorString;
			};
			coustomThemeDefaults();
		}
		else {
			throw "Unable to retrieve themes.json";
		}
	};
	document.getElementById("settings").onclick = () => {
		document.getElementById("settings").className = "spin";
		document.getElementById("menu").className = "grow";
		setTimeout(() => {
			document.getElementById("settings").className = "";
			document.getElementById("menu").className = "shrink";
		}, 400);
	};
};
window.themeChange = theme => {
	theme = theme.toLowerCase();
	if (typeof themes[theme] === "object") {
		root.style.setProperty("--light", themes[theme].gradientLight);
		root.style.setProperty("--dark", themes[theme].gradientDark);
		root.style.setProperty("--headTxt", themes[theme].headTextColor);
		document.body.style.backgroundColor = themes[theme].bodyBgColor;
	}
	else {
		throw theme + "is not an avalable theme";
	}
};