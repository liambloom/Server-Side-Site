//jshint esversion:6
const post = elem => {
	if (window.confirm("Are you sure you want to submit this?")) {
		msg = document.querySelector(elem).value.toString() + "\n\n";
		req = new XMLHttpRequest();
		req.open("POST", "/sugestions/sugestions.txt", true);
		req.setRequestHeader("Content-Type", "text/javascript; charset=utf-8");
		
		req.onload = () => {
			if (req.status === 200) {
				console.log("Yay it worked!");
			}
			else {
				window.alert("Uh oh. Something went wrong!");
			}
		};
		req.send(msg);
	}
};