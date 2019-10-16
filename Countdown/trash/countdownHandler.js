//jshint esversion:6
const countdownHandler = info => {
	var dateArray = info.date.split("-");
	var timeArray = info.time.split(":");
	c = new Date(Number(dateArray[0]), Number(dateArray[1]) - 1, Number(dateArray[2]), Number(timeArray[0]), Number(timeArray[1]), info.second, info.millisecond).getTime();
	n = new Date().getTime();
	//var t = c - n;
	if (t <= 0) alert("You can't a countdown for something that's already happend");
	else var count = setInterval(() => {
		msCountdown(c, () => end(info.msg, info.endbg));
	}, 1);
};
const splitter = info => {
	const dateArray = info.date.split("-");
	const timeArray = info.time.split(":");
	return {date: dateArray, time: timeArray};
};