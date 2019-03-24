//jshint esversion:6
const set = (element, value, fun) => {
	if (document.getElementById(element).innerHTML != value) {
		fun();
	}	
};