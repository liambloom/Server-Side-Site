//jshint esversion:6
const links = {
	get NewYearsDay() {
		return "date=" + findYear(this.n.getMonth(), 0) + "-01-01&name=" + findYear(this.n.getMonth(), 0) + "&msg=Happy+New+Year";
	},
	get MLKDay() {
		return "date=" + findYear(this.n.getMonth(), 0) + "-01-" + findDay(findYear(this.n.getMonth(), 0), 0, 1, 3) + "&name=Martin+Luther+King+Jr.+Day&msg=Happy+Martin+Luther+King+Jr.+Day";
	},
	get PresidentsDay() {
		return "date=" + findYear(this.n.getMonth(), 1) + "-02-" + findDay(findYear(this.n.getMonth(), 1), 1, 1, 3) + "&name=Presidents'+Day&msg=Happy+Presidents'+Day";
	},
	get MemorialDay() {
		return "date=" + findYear(this.n.getMonth(), 4) + "-05-" + findLast(findYear(this.n.getMonth(), 4), 4, 1) + "&name=Memorial+Day&msg=Never+Forget&endbg=flag";
	},
	get IndependenceDay() {
		return "date=" + findYear(this.n.getMonth(), 6) + "-07-04&name=Independence+Day&msg=Happy+Independence+Day";
	},
	get LaborDay() {
		return "date=" + findYear(this.n.getMonth(), 8) + "-09-" + findDay(findYear(this.n.getMonth(), 8), 8, 1, 1) + "&name=Labor+Day&msg=Happy+Labor+Day";
	},
	get ColumbusDay() {
		return "date=" + findYear(this.n.getMonth(), 9) + "-10-" + findDay(findYear(this.n.getMonth(), 9), 9, 1, 2) + "&name=Columbus+Day&msg=Happy+Columbus+Day&endbg=ship";
	},
	get VeteransDay() {
		return "date=" + findYear(this.n.getMonth(), 10) + "-11-11&name=Veterans+Day&msg=Never+Forget&endbg=flag";
	},
	get ThanksgivingDay() {
		return "date=" + findYear(this.n.getMonth(), 10) + "-11-" + findDay(findYear(this.n.getMonth, 10), 10, 4, 4) + "&name=Thanksgiving&msg=Happy+Thanksgiving&endbg=turkey";
	},
	get ChristmasDay() {
		return "date=" + findYear(this.n.getMonth(), 11) + "-12-25&name=Christmas&msg=Merry+Christmas&endbg=christmasTree";
	},
	get Test() {
		return "date=" + this.n.getFullYear() + "-" + (this.n.getMonth() + 1) + "-" + this.n.getDate() + "&time=" + this.n.getHours() + ":" + this.n.getMinutes() + "&seconds=" + (this.n.getSeconds() + 5) + "&name=Results&msg=Now";
	},
	get n() {
		return new Date();
	}
};
/*Object.defineProperty(links, "n", {
	get: () => {return new Date();}
});*/