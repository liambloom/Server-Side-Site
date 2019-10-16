//jshint esversion:6
function readable(bg = document.body.style.backgroundImage) {
	//console.log("readable ran");
	switch(bg) {
		case 'url("./img/Hourglass.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/Hourglass.gif")':
		case 'url("./img/fireworks.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/fireworks.gif")':
			cssVarChange('#EE2277', '#a7145d', '#0d1532');
			return true;
		case 'url("./img/Hourglass2.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/Hourglass2.gif")':
		case 'url("./img/christmasTree.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/christmasTree.gif")':
			cssVarChange('#70dfbf', '#8cc4e0', '#3f1fcf');
			return true;
		case 'url("./img/Hourglass3.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/Hourglass3.gif")':
			cssVarChange('#1f150c', '#452d13', '#f4f6f5');
			return true;
		case 'url("./img/HourglassChristmas.gif")':
		case 'url("./img/fireworks.gif")':
			cssVarChange('#2dd2c7', '#24877e', '#0f524d');
			return true;
		case 'url("./img/flag.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/flag.gif")':
			cssVarChange('#101020', '#2a2937', '#792127');
			return true;
		case 'url("./img/ship.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/ship.gif")':
			cssVarChange('#daa520', '#ffd700', '#a6b7c6');
			return true;
		case 'url("./img/turkey.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/turkey.gif")':
			cssVarChange('#f8d81d', '#d3be32', '#ef8cb0');
			return true;
		case 'url("./img/birthday.gif")':
		case 'url("https://liambloom.github.io/Countdown/img/birthday.gif")':
			cssVarChange('#ffffff', '#ffff95', '111111');
			return true;
		default:
			cssVarChange('#EE2277', '#a7145d', '#0d1532');
			document.body.style.backgroundImage = 'url("./img/Hourglass.gif")';
			return false;
	}
}