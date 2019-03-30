//jshint esversion:6
const onenter = (element, func) => document.querySelector(element).onkeyup = event => {
	if (event.keycode === 13) func();
};