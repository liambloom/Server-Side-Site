//jshint esversion:7
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
    document.getElementsByTagName("header")[0].style.setProperty("grid-template-columns", "117px " + CSS.supports("width: max-content") ? "max-content" : "initial");
  }
  else {
    document.getElementsByTagName("header")[0].style.setProperty("grid-template-columns", "117px calc(100% - 117px)");
  }
};

// Old
window.errMsg = (e, msg) => {
  if (msg) {
    e.parentNode.setAttribute("data-err", msg);
    e.setCustomValidity(msg);
  }
  else {
    e.parentNode.removeAttribute("data-err");
    e.setCustomValidity("");
  }
};

let newStyle = document.createElement("style");
document.head.appendChild(newStyle);
window.arrowFix = newStyle.sheet;
window.onload = () => {
  window.onresize();
  
  fetch("/api/json/themes.json")
    .then(res => {
      if (res.ok) return res.json();
      else throw "Unable to retrieve themes.json";
    })
    .then(res => window.themes = res)
    .then(res => {
      if (res.user) {
        console.log(`res.user.color = ${res.user.color}`);
        theme.color = res.user.color;
        theme.mode = res.user.mode;
      }
      else {
        console.log(`theme.default.color = ${theme.default.color}`);
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
    document.getElementById("settings").onclick = () => {
      if (document.getElementById("settings").className === "") {
        document.getElementById("settings").className = "spin";
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
    document.querySelector(`#${id(e)} ul`).style.setProperty("height", CSS.supports("width: max-content") ? "max-content" : "initial");
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

  if (!localStorage.getItem("cookie") && !document.getElementById("loggedIn")) document.getElementsByTagName("footer")[0].classList.remove("hidden");
  document.getElementById("yesCookie").addEventListener("click", () => {
    localStorage.setItem("cookie", "true");
    console.log(`theme.color = ${theme.color}`);
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
};
window.onscroll = () => {
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
			if (this.mode === "dark") {
				root.style.setProperty("--bg", themes[name].offBlack);
				root.style.setProperty("--txt", themes[name].headTextColor);
			}
			else {
				root.style.setProperty("--bg", themes[name].offWhite);
				root.style.setProperty("--txt", themes[name].offBlack);
			}
      fetch("/api/users", {
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
			throw name.titleCase() +  " is not an avalable theme";
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
        document.getElementById("CBT_credit").setAttribute("src", "/img/CBT_OS-logo_Black-V.svg");
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
        document.getElementById("CBT_credit").setAttribute("src", "/img/CBT_OS-logo_White-V.svg");
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
      fetch("/api/users", {
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
			throw name.titleCase() + " is not an avalable theme";
		}
	},
	default: {
		color: localStorage.getItem("color") || "teal",
    mode: localStorage.getItem("mode") || "light"
	}
};
var closeMenu = () => {
  document.getElementById("choose").classList.replace("grow", "shrink");
  document.getElementById("settings").className = "";
  setTimeout(() => {
    document.getElementById("arrow").classList.add("gone");
  }, 300);
  setTimeout(() => {
    document.getElementById("chooseTooltip").classList.remove("noTooltip");
  }, 500);
};
window.deleteEmail = () => {
  modal.open("#loadingModal");
  activateLoading();
  fetch("/api/email", {
    method: "DELETE"
  })
    .then(res => {
      modal.close();
      deactivateLoading();
      return res;
    })
    .then(res => {
      if (res.ok) return res;
      else throw res;
    })
    .then(() => {
      modal.open("#emailDeleted");
      document.getElementById("emailCell").innerHTML = "none";
      document.getElementById("emailButtonsCell").innerHTML = `<a class="button" href="/update?c=email&u=${location.pathname}">Add</a>`;
    })
    .catch(err => {
      modal.open("#emailFaliure");
      document.getElementById("error").innerHTML = err.json() || "";
      console.error(err.json());
    });
};
window.switchTab = (e, name, big) => {
  document.querySelector(".inner:not(.hidden)").classList.add("hidden");
  document.querySelector(".tab.active").classList.remove("active");
  document.getElementById(name).classList.remove("hidden");
  e.target.classList.add("active");
  document.getElementById("choose").classList.toggle("big", big || false);
};