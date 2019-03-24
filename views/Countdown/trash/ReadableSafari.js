function Readable() {
	switch(document.body.style.backgroundImage){
		case "url(\"https://liambloom.github.io/Countdown/img/Hourglass.gif\")":
			cssVarChange("#EE2277", "#a7145d", "#0d1532");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/Hourglass2.gif\")":
			cssVarChange("#70dfbf", "#8cc4e0", "#3f1fcf");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/Hourglass3.gif\")":
			cssVarChange("#1f150c", "#452d13", "#f4f6f5");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/HourglassChristmas.gif\")":
			cssVarChange("#2dd2c7", "#24877e", "#0f524d");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/fireworks.gif\")":
			cssVarChange("#EE2277", "#a7145d", "#0d1532");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/christmasTree.gif\")":
			cssVarChange("#70dfbf", "#8cc4e0", "#3f1fcf");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/flag.gif\")":
			cssVarChange("#101020", "#2a2937", "#792127");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/ship.gif\")":
			cssVarChange("#daa520", "#ffd700", "#a6b7c6");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/turkey.gif\")":
			cssVarChange("#f8d81d", "#d3be32", "#ef8cb0");
			break;
		case "url(\"https://liambloom.github.io/Countdown/img/birthday.gif\")":
			cssVarChange("#ffffff", "#ffff95", "111111");
			break;
		default:
			cssVarChange("#EE2277", "#a7145d", "#0d1532");
			document.body.style.backgroundImage = 'url(\"./img/Hourglass.gif\")';
	}
	//console.log("ReadableSafari ran")
}