//jshint esversion:7
String.prototype.titleCase = function () {//arrow functions have a different use of "this" property
	return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.change = function () {
	if (this.toString() === theme.mode) {
		if (theme.mode === "dark") theme.mode = "light";
		else theme.mode = "dark";
	}
};
window.eventToElement = (event, e) => [...event.target.parentNode.children].find(event => event.tagName === e.toString().toUpperCase());
window.timeout = {};
window.root = document.documentElement;//imposible to not get this first
window.onresize = () => {
	root.style.setProperty("--size", -document.getElementsByTagName("h1")[0].clientHeight - 5 + "px");
	root.style.setProperty("--angle", Math.atan(document.getElementsByTagName("header")[0].clientHeight/window.innerWidth) + "rad");
  if (window.innerWidth <= document.querySelector("header h1").clientWidth + 117) {
    //document.getElementsByTagName("header")[0].style.setProperty("grid-template-columns", "max-content");
    document.getElementsByTagName("header")[0].style.setProperty("grid-template-columns", "117px max-content");
  }
  else {
    //document.getElementsByTagName("header")[0].style.setProperty("grid-template-columns", "100%");
    document.getElementsByTagName("header")[0].style.setProperty("grid-template-columns", "117px calc(100% - 117px)");
  }
};
  let newStyle = document.createElement("style");
  document.head.appendChild(newStyle);
  window.arrowFix = newStyle.sheet;
window.onload = () => {
  window.onresize();
  //if (localStorage.getItem("color") !== null) theme.default.color = localStorage.getItem("color");
  //if (localStorage.getItem("mode") !== null) theme.default.mode = localStorage.getItem("mode");
  
  fetch("/api/json/themes.json")
    .then(res => {
      if (res.ok) return res.json();
      else throw "Unable to retrieve themes.json";
    })
    .then(res => window.themes = res)
    .then(res => {
      if (res.user) {
        theme.color = res.user.color;
        theme.mode = res.user.mode;
      }
      else {
        theme.color = theme.default.color;
        theme.mode = theme.default.mode;
      }
    })
    .then(() => {
      window.dispatchEvent(new Event("themeReady"));
      window.themeReady = true;
    });
    //.catch(err => );

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
    root.style.setProperty("--path", `path("${path.replace(/\n\s+/g, "")}")`);
    document.getElementById("settings").onclick = () => {
      if (document.getElementById("settings").className === "") {
        document.getElementById("settings").className = "spin";
        /*document.getElementById("choose").classList.add("grow");
        document.getElementById("choose").classList.remove("shrink");*/
        document.getElementById("choose").classList.replace("shrink", "grow");
        document.getElementById("arrow").classList.remove("gone");
        document.getElementById("chooseTooltip").classList.add("noTooltip");
      }
      else {
        closeMenu();
      }
    };
  }
  catch (err) {
  }
  document.onclick = event => {
    try {
      if (!event.target.closest("#choose, #settings") && document.getElementById("settings").className !== "") closeMenu();
    }
    catch (err) {
    }
  };

  document.getElementById("Capa_1").onclick = () => {
    if (CSS.supports("width: max-content")) {
      var tooltip = [...document.getElementById("visibility").children].find(i => i.tagName === "DIV");
      var tooltipProps = tooltip.getBoundingClientRect();
      var pointerX = parseFloat(window.getComputedStyle(tooltip, "::after").left);
    }
    if (document.getElementById("visibility").className === "down") {// Expand Menu
      document.getElementById("visibility").className = "up";
      document.querySelector("#visibility .arrowBox").innerHTML = "Collapse Menu";
      document.getElementsByTagName("header")[0].style.display = "grid";
      document.getElementById("path2Arrow").style.setProperty("fill", "#000000");
      document.getElementById("g10-user").style.setProperty("fill", "#000000"); 
      try {
        document.getElementById("path2Settings").style.setProperty("fill", "#000000");
      }
      catch (err) {
      }
      window.onscroll();
    }
    else {// Collapse Menu
      document.getElementById("visibility").className = "down";
      document.querySelector("#visibility .arrowBox").innerHTML = "Expand Menu";
      document.getElementsByTagName("header")[0].style.display = "none";
      if (theme.mode === "dark") {
        document.getElementById("path2Arrow").style.setProperty("fill", "#ffffff");
        document.getElementById("g10-user").style.setProperty("fill", "#ffffff");
        try {
          document.getElementById("path2Settings").style.setProperty("fill", "#ffffff");
        }
        catch (err) {
        }
      }
    }
    if (CSS.supports("width: max-content")) {
      arrowPosition(tooltip, tooltipProps, pointerX);
    }
  };

  document.getElementById("lightArea").coords = `0, 0, ${document.getElementById("lightdark").clientWidth / 2}, ${document.getElementById("lightdark").clientHeight}`;
  document.getElementById("lightArea").addEventListener("click", e => {
    e.preventDefault();
    theme.mode = "light";
  });
  document.getElementById("darkArea").coords = `${document.getElementById("lightdark").clientWidth}, 0, ${document.getElementById("lightdark").clientWidth / 2}, ${document.getElementById("lightdark").clientHeight}`;
  document.getElementById("darkArea").addEventListener("click", e => {
    e.preventDefault();
    theme.mode = "dark";
  });

  document.querySelector("#logo svg").removeChild(document.querySelector("#logo svg title"));

  const elementHide = e => {
    e = e.target;
    if (window.timeout[id(e)] === undefined) window.timeout[e.id] = [];
    let opacity = parseFloat(window.getComputedStyle(document.querySelector(`#${e.id} ul`)).opacity);
    let time;
    if (opacity > 0.8) time = 400;// This is so the calculation isn't messed up by "ease-in"
    else time = opacity * 400;
    window.timeout[e.id].push(setTimeout(() => {
      [...e.children].find(event => event.tagName === "UL").style.setProperty("height", "0px");
    }, time));
  };
  const elementShow = event => {
    let e = event.target;
    try {
      clearTimeout(window.timeout[e.id][window.timeout[e.id].length - 1]);
      clearTimeout(window.timeout[e.id][window.timeout[e.id].length - 2]);
    }
    catch(err) {
    }
    document.querySelector(`#${id(e)} ul`).style.setProperty("height", "max-content");
  };
  for (let e of document.querySelectorAll("header nav > ul > li")) {
    e.addEventListener("mouseleave", e => {elementHide(e);});
    e.addEventListener("blur", e => {elementHide(e);});
  }
  for (let e of document.querySelectorAll("header nav > ul > li")) {
    e.addEventListener("mouseenter", e => { elementShow(e); });
    e.addEventListener("focus", e => { elementShow(e); });
  }

  let buttonFunc = e => {
    e.parentNode.dispatchEvent(new Event(e.id));
    if (e.parentNode.classList.contains("pick1")) [...e.parentNode.children].forEach(e => { e.classList.remove("active"); });
    if (e.classList.contains("stick") || e.parentNode.classList.contains("pick1")) e.classList.toggle("active");
  };
  for (let e of document.getElementsByClassName("button-3d")) {
    e.addEventListener("mousedown", () => {
      buttonFunc(e);
    });
    e.addEventListener("touchstart", () => {
      buttonFunc(e);
    });
  }

  //console.log(...[localStorage.getItem("cookie"), document.getElementById("loggedIn")]);
  if (!localStorage.getItem("cookie") && !document.getElementById("loggedIn")) document.getElementsByTagName("footer")[0].classList.remove("hidden");
  document.getElementById("yesCookie").addEventListener("click", () => {
    localStorage.setItem("cookie", "true");
    theme.color = theme.color;
    theme.mode = theme.mode;
    document.getElementsByTagName("footer")[0].classList.add("hidden");
  });
  document.getElementById("noCookie").addEventListener("click", () => {
    document.getElementsByTagName("footer")[0].classList.add("hidden");
  });

  if (CSS.supports("width: max-content")) {
    for (let e of document.querySelectorAll(".arrowBox.up:not(#choose), arrowBox.down")) {
      e.parentNode.style.setProperty("display", "inline-flex");
      e.parentNode.style.setProperty("justify-content", "center");
    }
    const align = event => {
      let tooltip = eventToElement(event, "DIV");
      let tooltipProps = tooltip.getBoundingClientRect();
      if (tooltipProps.right > window.innerWidth) {
        let pointerX = (tooltipProps.width / 2) - 10;
        tooltip.classList.add("arrowRight");
        event.target.parentNode.style.setProperty("justify-content", "flex-end");
        arrowPosition(tooltip, tooltipProps, pointerX);
      }
      event.target.removeEventListener("mouseenter", align);
    };
    window.arrowPosition = (tooltip, tooltipProps, pointerX) => {
      window.arrowFix.insertRule(`
        #${id(tooltip)}::after {
          left: ${(pointerX + (tooltipProps.left - tooltip.getBoundingClientRect().left))}px;
        }
      `, window.arrowFix.cssRules.length);
    };
    for (let e of document.querySelectorAll(".arrowBox")) {
      try {
        [...e.parentNode.children].filter(elem => elem.tagName === "svg")[0]
        .addEventListener("mouseenter", event => {align(event);});
      }
      catch (err) {}
    }
  }
  else {
    let ua = navigator.userAgent;
    let browser;
    if (/MSIE|Trident/i.test(ua)) {
      browser = "Internet Explorer";// IE will throw hundreds of errors before it gets this far
    }
    else if (/Edge/i.test(ua)) {
      browser = "Edge";
    }
    else if (/(?:iPhone|iPad)[^]+Safari/.test(ua)) {
      browser = "Safari for iOS";
    }
    else if (/Firefox/im.test(ua)) {
      browser = "old versions of Firefox";
    }
    else {
      browser = "your browser";
    }
    alert(`Some of the styling might be messed up in ${browser}. Most of the site should still work though.`);
  }
};
window.onscroll = () => {
  /*if (window.scrollY < document.getElementsByTagName("header")[0].clientHeight - (document.querySelector("header nav ul li.right").clientHeight + document.getElementById("topRight").clientHeight + 13)) {
    document.querySelector("header nav ul li.right").classList.remove("hide");
  }
  else {
    document.querySelector("header nav ul li.right").classList.add("hide");
  }*/
  document.querySelector("header nav ul li.right").classList.toggle("hide", !(window.scrollY < document.getElementsByTagName("header")[0].clientHeight - (document.querySelector("header nav ul li.right").clientHeight + document.getElementById("topRight").clientHeight + 13)));
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
      //localStorage.setItem("color", name);
      fetch("/api/users/theme", {
        method: "PUT",
        body: JSON.stringify({
          category: "color",
          value: name
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 401 && localStorage.getItem("cookie")) localStorage.setItem("color", name);
          return res;
        })
        .then(res => {
          if (!res.ok && res.status !== 401) console.error(res.error);
        });
			Object.defineProperty(this, "color", {
				get: function() {
					return name;
				}
      });
      window.dispatchEvent(new Event("colorChange"));
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
		if (/dark|light/.test(name)) {
			if (name === "light") {
				root.style.setProperty("--bg", themes[theme.color].offWhite);
				root.style.setProperty("--txt", themes[theme.color].offBlack);
				document.getElementById("path2Arrow").style.setProperty("fill", "#000000");
        if (typeof window.forLoadingIcons === "function") {
          window.forLoadingIcons(e => { e.style.setProperty("background-color", "#0000007f"); });
        }
				try {
					document.getElementById("path2Settings").style.setProperty("fill", "#000000");
				}
				catch (err) {
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
					try {
						document.getElementById("path2Settings").style.setProperty("fill", "#ffffff");
					}
					catch (err) {
					}
				}
			}
      //localStorage.setItem("mode", name);
      fetch("/api/users/theme", {
        method: "PUT",
        body: JSON.stringify({
          category: "light",
          value: name
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 401 && localStorage.getItem("cookie")) localStorage.setItem("mode", name);
          return res;
        })
        .then(res => {
          if (!res.ok && res.status !== 401) console.error(res.error);
        });
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
		color: localStorage.getItem("color") || "teal",
    mode: localStorage.getItem("mode") || "light"
	}
};
var closeMenu = () => {
  /*document.getElementById("choose").classList.add("shrink");
  document.getElementById("choose").classList.remove("grow");*/
  document.getElementById("choose").classList.replace("grow", "shrink");
  setTimeout(() => {
    document.getElementById("arrow").classList.add("gone");
  }, 300);
	setTimeout(() => {
    document.getElementById("settings").className = "";
  }, 400);
  setTimeout(() => {
    document.getElementById("chooseTooltip").classList.remove("noTooltip");
  }, 500);
};
window.switchTab = (e, name, big) => {
  document.querySelector(".inner:not(.hidden)").classList.add("hidden");
  document.querySelector(".tab.active").classList.remove("active");
  document.getElementById(name).classList.remove("hidden");
  e.target.classList.add("active");
  /*if (big) document.getElementById("choose").classList.add("big");
  else document.getElementById("choose").classList.remove("big");*/
  document.getElementById("choose").classList.toggle("big", big || false);
};