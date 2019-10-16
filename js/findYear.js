//jshint esversion:6
function findYear(month, day) {
	const n = new Date();
	if (n.getMonth() <= month && n.getDay() < day) {
		return n.getFullYear().toString();
	}else{
		return (n.getFullYear() + 1).toString();
	}
}