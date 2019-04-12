//jshint esversion:6
String.prototype.titleCase = function () {//arrow functions have a different use of "this" property
	return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.change = function () {
	if (this.toString() === theme.mode) {
		if (theme.mode === "dark") theme.mode = "light";
		else theme.mode = "dark";
	}
};
window.root = document.documentElement;//imposible to not get this first
window.onresize = () => {
	//console.log(-document.getElementsByTagName("h1")[0].clientHeight);
	root.style.setProperty("--size", -document.getElementsByTagName("h1")[0].clientHeight - 5 + "px");
	root.style.setProperty("--angle", Math.atan(document.getElementsByTagName("header")[0].clientHeight/window.innerWidth) + "rad");
  if (window.innerWidth <= document.querySelector("#fixed header h1").clientWidth + 117) {
    document.getElementById("fixed").style.setProperty("grid-template-columns", "max-content");
    document.querySelector("#fixed header").style.setProperty("grid-template-columns", "117px max-content");
  }
  else {
    document.getElementById("fixed").style.setProperty("grid-template-columns", "100%");
    document.querySelector("#fixed header").style.setProperty("grid-template-columns", "117px calc(100% - 117px)");
  }
};
window.onload = () => {
	window.onresize();
	if (localStorage.getItem("color") !== null) theme.default.color = localStorage.getItem("color");
	if (localStorage.getItem("mode") !== null) theme.default.mode = localStorage.getItem("mode");
  
  fetch("/json/themes.json")
    .then(res => {
      if (res.ok) return res.json();
      else throw "Unable to retrieve themes.json";
    })
    .then(res => window.themes = res)
    .then(() => {
      theme.color = theme.default.color;
      theme.mode=theme.default.mode;
      //return res;
    });
    //.catch(err => console.error(err));

  window.coustomThemeDefaults = () => {};//because it's called places but doesn't do anything anymore
  //I would get rid of it completely but it may do things again in the future

	try {
		path = `
			M20,10 
			h225 
			l7,-10 
			l7,10 
			h30 
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
			}
			else {
				closeMenu();
			}
		};
	}
	catch (err) {
		//console.error(err);
	}
	document.onclick = event => {
		try {
			if (!event.target.closest("#menu, #menuBox, #choose, #settings") && document.getElementById("settings").className !== "") closeMenu();
		}
		catch (err) {
			//console.error(err);
		}
	};

	document.getElementById("Capa_1").onclick = () => {
		if (document.getElementById("visibility").className === "down") {
			document.getElementById("visibility").className = "up";
			document.getElementById("visibility").title = "Collapse Menu";
			document.getElementsByTagName("header")[0].style.setProperty("display", "grid");
			document.getElementById("path2Arrow").style.setProperty("fill", "#000000");
			document.getElementById("path2switch").style.setProperty("fill", "#000000");
			try {
				document.getElementById("path2Settings").style.setProperty("fill", "#000000");
			}
			catch (err) {
				//console.error(err);
			}
		}
		else {
			document.getElementById("visibility").className = "down";
			document.getElementById("visibility").title = "Expand Menu";
			document.getElementsByTagName("header")[0].style.setProperty("display", "none");
			if (theme.mode === "dark") {
				document.getElementById("path2Arrow").style.setProperty("fill", "#ffffff");
				document.getElementById("path2switch").style.setProperty("fill", "#ffffff");
				try {
					document.getElementById("path2Settings").style.setProperty("fill", "#ffffff");
				}
				catch (err) {
					//console.error(err);
				}
			}
		}
	};

	document.getElementById("Layer_1").onclick = () => {
		//console.log("This Ran");
		theme.mode.change();
		if (document.getElementById("switchSpan").className === "down") {
			document.getElementById("switchSpan").className = "up";
			document.getElementById("switchSpan").title = "Light Mode";
		}
		else {
			document.getElementById("switchSpan").className = "down";
			document.getElementById("switchSpan").title = "Dark Mode";
		}
	};

  document.querySelector("#logo svg").removeChild(document.querySelector("#logo svg title"));
};
window.theme = {
	get color() {
		return this.default.color;
	},
	set color(name) {
		name = name.toLowerCase();
		if (typeof themes[name] === "object") {
			root.style.setProperty("--light", themes[name].gradientLight);
			root.style.setProperty("--dark", themes[name].gradientDark);
			root.style.setProperty("--headTxt", themes[name].headTextColor);
			//root.style.setProperty("--bg", themes[name].bodyBgColor);
			document.getElementById("stop4538").style = `stop-color:${themes[name].headTextColor};stop-opacity:1`;//Left
			document.getElementById("stop4540").style = `stop-color:${themes[name].gradientLight};stop-opacity:1`;//Right
			if (this.mode === "dark") {
				root.style.setProperty("--bg", themes[name].offBlack);
				root.style.setProperty("--txt", themes[name].headTextColor);
			}
			else {
				root.style.setProperty("--bg", themes[name].offWhite);
				root.style.setProperty("--txt", themes[name].offBlack);
			}
			try {
				document.getElementById("menuBox").setAttribute("fill", themes[name].gradientDark);
			}
			catch (err) {
				//console.error(err);
			}
			localStorage.setItem("color", name);
			Object.defineProperty(this, "color", {
				get: function() {
					return name;
				}
			});
		}
		else {
			throw name.titleCase +  " is not an avalable theme";
		}
	},
	get mode() {
		return this.default.mode;
	},
	set mode(name) {
		name = name.toLowerCase();
		//change the body bgcolor, setings fill color, and arrow fill color
		if (/dark|light/.test(name)) {
			if (name === "light") {
				root.style.setProperty("--bg", themes[theme.color].offWhite);
				root.style.setProperty("--txt", themes[theme.color].offBlack);
				document.getElementById("path2Arrow").style.setProperty("fill", "#000000");
        document.getElementById("path2switch").style.setProperty("fill", "#000000");
        if (typeof window.forLoadingIcons === "function") {
          window.forLoadingIcons(e => { e.style.setProperty("background-color", "#0000007f"); });
        }
				try {
					document.getElementById("path2Settings").style.setProperty("fill", "#000000");
				}
				catch (err) {
					//console.error(err);
				}
			}
			else {
				root.style.setProperty("--bg", themes[theme.color].offBlack);
        root.style.setProperty("--txt", themes[theme.color].headTextColor);
        if (typeof window.forLoadingIcons === "function") {
          window.forLoadingIcons(e => { e.style.setProperty("background-color", "#ffffff7f"); });
        }
				if (document.getElementById("visibility").className === "down") {
					document.getElementById("path2Arrow").style.setProperty("fill", "#ffffff");
					document.getElementById("path2switch").style.setProperty("fill", "#ffffff");
					try {
						document.getElementById("path2Settings").style.setProperty("fill", "#ffffff");
					}
					catch (err) {
						//console.error(err);
					}
				}
			}
			localStorage.setItem("mode", name);
			Object.defineProperty(this, "mode", {
				get: function () {
					return name;
				}
			});
		}
		else {
			throw name.titleCase + " is not an avalable theme";
		}
	},
	default: {
		color: "teal",
		mode: "dark"
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