function findLast(year, month, daytofind) {
	var finder = new Date(year, month, 1, 0, 0, 0, 0);
	var d = 0;
	var i = 0;
	for (i=0; i<=7 && finder.getMonth() == month;) {
		if (finder.getDay() == daytofind) {
			d++;
			i=0;
		}
		finder.setDate(finder.getDate() + 1);
	}
	return (findDay(year, month, daytofind, d));
}