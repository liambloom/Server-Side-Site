//jshint esversion:6
const msCountdown = (c, atEnd = () => end()) => {
	//console.log("msCoutndown ran");
	let n = new Date().getTime();
	let t = c - n;
	if (t <= 0) {
		//console.log(t);
		//console.log("end");
		atEnd();
		return;
	}
	else {
		//console.log(t);
		let u = Math.floor(t % 1000);
		//console.log(c);
		//throw "end";
		//console.log(u);
		if (u <= 35 && t >=1000) countdown3(t - 1000);
		u = "." + u.toString();
		while (u.length < 4) {
			u = u + "0";
		}
		document.getElementById("un").innerHTML = u;
	}
};