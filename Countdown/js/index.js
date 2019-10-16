//jshint esversion:6

const init = () => {
	//console.log("init ran");
	hash();
	window.onhashchange = hash;
	if (location.search == "") {
		destroy("main");
		if (check("datetime-local")) {
			destroy("dateTimeSeperate");
			destroy("dateTimeDropdown");
			destroy("betaWarning");
		}
		else if (check("date") && check("time")) {
			destroy("dateTimeTogether");
			destroy("dateTimeDropdown");
			destroy("betaWarning");
		}
		else {
			destroy("dateTimeSeperate");
			destroy("dateTimeTogether");
			makeDropdown("day", 1, 31, 1);
			makeDropdown("year", n.getFullYear(), n.getFullYear() + 5, 1);
			makeDropdown("hour", 1, 11, 1);
			makeDropdown("minute", 0, 59, 2);
		}
	}
	else {
		destroy("menu");
		const entries = new URLSearchParams(location.search).entries();
		//info = infoDefault;
		for (let pair of entries) {
			if (/\S/.test(pair[1].toString())) {
				info[pair[0]] = pair[1];
			}
		}
		try {
			info.endbg = `url("./img/${info.endbg}.gif")`;
		}
		catch (err) {}
		document.getElementById("sl").innerHTML = "seconds";
		document.getElementById("to").innerHTML = info.name;
		/*var dateArray = info.date.split("-");
		var timeArray = info.time.split(":");*/
		if (info.dateTime) {
			const dtArray = info.dateTime.split("T");
			info.datetime = splitter(dtArray[0], dtArray[1]);//this needs to be set to a variable
		}
		else if (info.date && info.time) {
			info.datetime = splitter(info.date, info.time);
		}
		else if (info.month && info.day && info.year && info.hour && info.minute && info.ampm) {
			info.datetime = {
				date: [info.year, info.month, info.day],
				time: [info.hour + info.ampm, info.minute]
			};
		}
		/*else {
			info.datetime = {
				date: ["1970", "0", "1"],
				time: ["0", "0"]
			};
		}*/
		const c = new Date(Number(info.datetime.date[0]), Number(info.datetime.date[1]) - 1, Number(info.datetime.date[2]), Number(info.datetime.time[0]), Number(info.datetime.time[1]), info.seconds, info.milliseconds).getTime();
		//console.log(Number(info.datetime.date[0]), Number(info.datetime.date[1]) - 1, Number(info.datetime.date[2]), Number(info.datetime.time[0]), Number(info.datetime.time[1]), info.seconds, info.milliseconds);
		let n = new Date().getTime();
		let t = c - n;
		//if (t <= 0) alert("You can't a countdown for something that's already happend");
		countdown3(t);
		window.count = setInterval(() => {
			msCountdown(c, () => end(info.msg, info.endbg));//can I just pass in end() and not () => end()
		}, 1);
		
		//window.onload = readable();
		if (info.hgbg != undefined && info.hgbg != "") {
			destroy("hourglassMenu");
			document.body.style.backgroundImage = `url("./img/${info.hgbg}.gif")`;
		}
		/*else {
			document.body.style.backgroundImage = `url("./img/Hourglass.gif")`;
		}*/
	}
	window.onload = () => {
		//console.log("readable paramiter ran");
		if (readable()) {
			try {
				destroy("hourglassMenu");
			} 
			catch (err) {}	
		}
	};
	if (document.readyState === "complete") {
		window.onload();
	}
	try {
		//var linkslist = ["NewYearsDay", "MartinLutherKingJrDay", "GeorgeWashingtonsBirthday", "MemorialDay", "IndependenceDay", "LaborDay", "ColumbusDay", "VeteransDay", "ThanksgivingDay", "ChristmasDay", "Test"];
		document.getElementById("hourglassSubmit").onclick = () => {
			if (document.getElementById('hourglassSave')) {
				document.getElementById('hourglassSave').value = document.getElementById("hourglassselect").value;
				linkAdd(links, "?hgbg=" + document.getElementById("hourglassselect").value);
			}
			else {
				location.assign(location.search + "&hgbg=" + document.getElementById("hourglassselect").value);
			}
			destroy('hourglassMenu');
		};
	} 
	catch (err) {}
	try {
		window.addEventListener('load', () => {
			if (!(CSS.supports('color', 'var(--fake-var)'))) {
				Redirect("Error: CSS variables are not supported");
			}
		}, false);
	}
	catch (err) {
		Redirect("Error: CSS variables are not supported");
	}
};