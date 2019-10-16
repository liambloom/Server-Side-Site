//jshint esversion:6
const fs = require ("fs");

fs.readFile("./Countdown/infoDefault.js", (err, data) => {
	if (err) throw err;
	else var info = data;
});

exports.handle = query => {
	const entries = new URLSearchParams(query).entries();
	for (let pair of entries) {
		if (/\S/.test(pair[1].toString())) {
			info[pair[0]] = pair[1];
		}
	}

};

fs.readFile("./Countdown/links.js", (err, data) => {
	if (err) throw err;
	else exports.pre = (event) => exprorts.handle(data.event);
});