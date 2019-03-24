function inputHandler() {
	function addToPageText(whatToAdd, bullet) {
		if (bullet == undefined) {bullet = ">"}
		document.getElementById("pageText").innerHTML += bullet + " " + whatToAdd + "<br>";
	}
	var input = document.getElementById("textbox").value;
	var output;

	if (input.indexOf(stateinfo.textboxDefault) != 0) {
		stateinfo.textboxDefault = ""
	}
	/*if (input.indexOf("/") == 0){
		if (stateinfo.cheatsEnabled || input.indexOf("/u") == 0) {
			output = slash(input)
		}
		else {
			output = "Error: Cheats are not Enabled<br>\
				To enable cheats type &quot;/u.enable_cheats&quot;"
		}
	}
	else if (input.indexOf("#" == 0)){
		output = hash(input);
	}*/

	//this code stays at the end
	document.getElementById("textbox").value = stateinfo.textboxDefault
	addToPageText(input)
	if (output != undefined){
			output = output.replace(/<br>/g, "<br><span class='indent'>")
			output += "</span>"
		addToPageText(output, "<")
	}
}