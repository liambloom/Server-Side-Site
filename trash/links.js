function linksMaker(index, add) {
	var n = new Date();
	switch(index){
		case 0:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 0) + "-01-01&4=" + findYear(n.getFullYear(), n.getMonth(), 0) + "&5=Happy+New+Year";
		case 1:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 0) + "-01-" + findDay(findYear(n.getFullYear(), n.getMonth(), 0), 0, 1, 3) + "&4=Martin+Luther+King+Jr.+Day&5=Happy+Martin+Luther+King+Jr.+Day";
		case 2:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 1) + "-02-" + findDay(findYear(n.getFullYear(), n.getMonth(),  1), 1, 1, 3) + "&4=Presidents'+Day&5=Happy+Presidents'+Day";
		case 3:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 4) + "-05-" + findLast(findYear(n.getFullYear(), n.getMonth(), 4), 4, 1) + "&4=Memorial+Day&5=Never+Forget&6=flag";
		case 4:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 6) + "-07-04&4=Independence+Day&5=Happy+Independence+Day";
		case 5:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 8) + "-09-" + findDay(findYear(n.getFullYear(), n.getMonth(), 8), 8, 1, 1) + "&4=Labor+Day&5=Happy+Labor+Day";
		case 6:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 9) + "-10-" + findDay(findYear(n.getFullYear(), n.getMonth(), 9), 9, 1, 2) + "&4=Columbus+Day&5=Happy+Columbus+Day&6=ship";
		case 7:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 10) + "-11-11&4=Veterans+Day&5=Never+Forget&6=flag";
		case 8:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 10) + "-11-" + findDay(findYear(n.getFullYear(), n.getMonth, 10), 10, 4, 4) + "&4=Thanksgiving&5=Happy+Thanksgiving&6=turkey";
		case 9:
			return add + "?0=" + findYear(n.getFullYear(), n.getMonth(), 11) + "-12-25&4=Christmas&5=Merry+Christmas&6=christmasTree";
		case 10:
			return add + "?0=" + n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate() + "&1=" + n.getHours() + ":" + n.getMinutes() + "&2=" + (n.getSeconds() + 15) + "&4=Results&5=Now";
		case "all":
			var linkslist = [];
			for (var i = 0; i <= 10; i++) {
				linkslist.pust(add + linksMaker(i));
			}
			return linkslist;
	}
}