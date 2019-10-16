//jshint esversion:6
const splitter = (date, time) => {
	const dateArray = date.split("-");
	const timeArray = time.split(":");
	return { date: dateArray, time: timeArray };
};