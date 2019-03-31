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
			//document.getElementById("picker").appendChild(colorMenu);
			//This will be hard, but doable
			rootstyle = getComputedStyle(root);
			//console.log(rootstyle.getPropertyValue("--light"));
			window.coustomThemeDefaults = () => {
				/*document.getElementById("light").value = rootstyle.getPropertyValue("--light");
				document.getElementById("dark").value = rootstyle.getPropertyValue("--dark");
				document.getElementById("text").value = rootstyle.getPropertyValue("--headTxt");
				let bgcolorArray = document.body.style.backgroundColor.match(/\d+/g);
				let bgcolorString = "#";
				for (let i = 0; i < 3; i++) {
					bgcolorString += parseInt(bgcolorArray[i]).toString(16);
				}
				document.getElementById("bgcolor").value = bgcolorString;*/
			};
			coustomThemeDefaults();
		}
		else {
			throw "Unable to retrieve themes.json";
		}
	};
	try {
		path = `
			M20,10 
			h250 
			l7,-10 
			l7,10 
			h5 
			a10,10 0 0 1 10,10 
			v${Math.floor(window.innerHeight * 0.9) - 31} 
			a10,10 0 0 1 -10,10 
			h-278 
			a10,10 0 0 1 -10,-10 
			v-${Math.floor(window.innerHeight * 0.9) - 31} 
			a10,10 0 0 1 10,-10 
			z`;
		document.getElementById("menuBox").setAttribute("d", path);
		root.style.setProperty("--path", `path("${path.replace(/\n\s+/g, "")}")`);
		document.getElementById("settings").onclick = () => {
			if (document.getElementById("settings").className === "") {
				document.getElementById("settings").className = "spin";
				document.getElementById("menu").className.baseVal = "grow";
				document.getElementById("menuBox").setAttribute("style", "display: initial;");
				document.getElementById("menuBox").setAttribute("class", "grow");
				document.getElementById("choose").className = "grow";
				//console.log(document.getElementById("menuBox").className.baseVal);
			}
			else {
				closeMenu();
			}
		};
	}
	catch (err) {
		console.error(err);
	}
	document.onclick = event => {
		try {
			if (!event.target.closest("#menu, #menuBox, #choose, #settings") && document.getElementById("settings").className !== "") closeMenu();
		}
		catch (err) {
			console.error(err);
		}
	};
	const textInputs = document.querySelectorAll("input[type = 'text'], input[type = 'username'], input[type = 'password'], input[type = 'email']");
	for (let i of textInputs) {
		console.log("set");
		i.addEventListener("focus", () => {i.classList.add("load");});
	}
};
window.themeChange = theme => {
	theme = theme.toLowerCase();
	if (typeof themes[theme] === "object") {
		root.style.setProperty("--light", themes[theme].gradientLight);
		root.style.setProperty("--dark", themes[theme].gradientDark);
		root.style.setProperty("--headTxt", themes[theme].headTextColor);
		root.style.setProperty("--bg", themes[theme].bodyBgColor);
		document.getElementById("stop4538").style = `stop-color:${themes[theme].headTextColor};stop-opacity:1`;//Left
		document.getElementById("stop4540").style = `stop-color:${themes[theme].gradientLight};stop-opacity:1`;//Right
		try {
			document.getElementById("menuBox").setAttribute("fill", themes[theme].gradientDark);
		}
		catch (err) {
			console.error(err);
		}
	}
	else {
		throw theme + "is not an avalable theme";
	}
};
var closeMenu = () => {
	document.getElementById("menu").className.baseVal = "shrink";
	document.getElementById("menuBox").setAttribute("class", "shrink");
	document.getElementById("choose").className = "shrink";
	setTimeout(() => {
		document.getElementById("menuBox").setAttribute("style", "display: none;");
		document.getElementById("settings").className = "";
	}, 200);
};