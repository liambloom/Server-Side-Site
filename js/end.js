//jshint esversion:6
const end = (message = "Something Happened", background = 'url("./img/fireworks.gif")') => {
	document.body.style.backgroundImage = background;
	//console.log(background);
	document.getElementById("t").innerHTML = message;
	if (document.body.style.backgroundImage == background) {
		readable(background);
	}
	try {
		destroy("hourglassMenu");
	}
	catch (err) { }
	clearInterval(window.count);
};