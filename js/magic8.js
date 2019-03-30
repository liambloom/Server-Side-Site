function decisionMaker() {
	var Magic8Ball = [
		"It is certain",
		"It is decidedly so",
		"Without a doubt",
		"Yes, definitely",
		"You may rely on it",
		"As I see it, yes",
		"Most likely",
		"Outlook good",
		"Yes",
		"Signs point to yes",
		"Reply hazy, try again",
		"Ask again later",
		"Better not tell you now",
		"Cannot predict now",
		"Concentrate and ask again",
		"Don't count on it",
		"My reply is no",
		"My sources say no",
		"Outlook not so good",
		"Very doubtful"];
	document.getElementById("Answer").innerHTML = "<b>" + (Magic8Ball[Math.floor(Math.random() * 20)]) + "</b>";
	document.getElementById("question").value = "";
}
if (document.readyState === "load") {
	console.log("one ran");
	onenter("#question", decisionMaker);
}
else {
	console.log("two set");
	document.addEventListener("load", () => {
		console.log("two ran");
		onenter("#question", decisionMaker);
	});
}