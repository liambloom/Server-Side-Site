//jshint esversion:6
function decisionMaker() {
	if (/\S/.test(document.getElementById('question').value)) {
		document.getElementById("Answer").innerHTML = "<b>" + (magic8Ball[Math.floor(Math.random() * 20)]) + "</b>";
		document.getElementById("question").value = "";
		document.getElementById("question").blur();
	}
}
if (document.readyState === "complete") onenter("#question", decisionMaker);
else window.addEventListener("load", () => {onenter("#question", decisionMaker);});
var magic8Ball = [
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
	"Very doubtful"
];