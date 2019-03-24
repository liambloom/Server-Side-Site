function Redirect(error){
	if (window.confirm('This version of the countdown is not supported in your browser. You will be redirected to an earlier version of the countdown program. I apologise for any inconvenience.\n' + error)){
		window.location.assign("https://liambloom.github.io/NewYearCountdown2.html");
	}
}