//jshint esversion:6
const check = type => {
	const test = document.createElement("input");
	test.setAttribute("type", type);
	if (test.type != type) return false;
	else {
		test.setAttribute("value", "foo");
		return test.value !== "foo";
	}
};