function addBar() {
var main = new Menu();
perego.css = ["span.beta {\
	vertical-align: super;\
	font-style: italic;\
	color: #e79622;\
}",
"span.alpha {\
	vertical-align: super;\
	font-style: italic;\
	color: #f92472;\
}",
"span.sub {\
	vertical-align: sub;\
	font-style: italic;\
	color: transparent;\
}"
];//Add beta and alpha to initial css and make them an input for Option
//Also add something to balance out the fact that the words are lower
var home = new Option("Home<span class='beta'></span><span class='sub'></span>");
home.innerMenu = new Menu([
	["Magic Eight Ball", "/MagicEight.html"], 
	["Random Color", "/RandomColor.html"], 
	["Gradient Color", "/GradientColor.html"]
]);
var countdown = new Option("Countdown<span class='beta'></span><span class='sub'></span>", "/Countdown/index.html");
countdown.innerMenu = new Menu([
	["New Years Day", "/index.html#NewYearsDay"],
	["Martin Luther King Jr. Day", "/index.html#MartinLutherKingJrDay"],
	["George Washington's Birthday", "/index.html#GeorgeWashingtonsBirthday"],
	["Memorial Day", "/index.html#MemorialDay"],
	["Independence Day", "/index.html#IndependenceDay"],
	["Labor Day", "/index.html#LaborDay"],
	["Columbus Day", "/index.html#ColumbusDay"],
	["Veterans Day", "/index.html#VeteransDay"],
	["Thanksgiving Day", "/index.html#ThanksgivingDay"],
	["Christmas Day", "/index.html#ChristmasDay"],
	["Test", "/index.html#Test"]
]);
var cb = new Option("Countdown<span class='beta'>beta</span><span class='sub'></span>", "/Countdown/beta.html");
cb.innerMenu = new Menu([
	["New Years Day<span class='beta'>beta</span>", "/beta.html#NewYearsDay"],
	["Martin Luther King Jr. Day<span class='beta'>beta</span>", "/beta.html#MartinLutherKingJrDay"],
	["George Washington's Birthday<span class='beta'>beta</span>", "/beta.html#GeorgeWashingtonsBirthday"],
	["Memorial Day<span class='beta'>beta</span>", "/beta.html#MemorialDay"],
	["Independence Day<span class='beta'>beta</span>", "/beta.html#IndependenceDay"],
	["Labor Day<span class='beta'>beta</span>", "/beta.html#LaborDay"],
	["Columbus Day<span class='beta'>beta</span>", "/beta.html#ColumbusDay"],
	["Veterans Day<span class='beta'>beta</span>", "/beta.html#VeteransDay"],
	["Thanksgiving Day<span class='beta'>beta</span>", "/beta.html#ThanksgivingDay"],
	["Christmas Day<span class='beta'>beta</span>", "/beta.html#ChristmasDay"],
	["Test<span class='beta'>beta</span>", "/beta.html#Test"]
]);
var school = new Option("School<span class='beta'></span><span class='sub'></span>", "/school/index.html");
school.innerMenu = new Menu([
	["Ancient Egyptian Social Class Project", "/SocialStudiesProject.html"],
	["Science Vocab", "/ScienceVocab.html"],
	["Greek Mythology Play Script", "/ELAgreekMythologyScript.html"],
	["Prometheus Cartoon", "!https://scratch.mit.edu/projects/221553121/"],
	["Social Studies Flash Cards<span class='beta'>beta</span>", "/SocialStudiesFlashCards.html"]
]);
/*var lib = new Option("Libraries<span class='beta'></span><span class='sub'></span>", "/lib/index.html");//Add something here
var peregoMenu = new Menu([
	["Perego Guide", "/html/index.html"],
	["Perego.js", "/Perego.js"],
	["Perego.js<span class='beta'>beta</span>", "/PeregoBeta.js"]
]);
var peregoOption = new Option("Perego", "/Perego/Perego.js");
peregoOption.innerMenu = peregoMenu;
var lupinMenu = new Menu([
	["Lupin.js", "/Lupin.js"],
	["Lupin.js<span class='beta'>beta</span>", "/LupinBeta.js"]
])
var lupinOption = new Option("Lupin", "/Lupin/Lupin.js");
lupinOption.innerMenu = lupinMenu;
libMenu = new Menu();
libMenu.option = [
	peregoOption,
	lupinOption
];
lib.innerMenu = libMenu;*/
main.option = [home, countdown, cb, school/*, lib*/];
main.hide = new Option("Hide Menu<span class='beta'></span><span class='sub'></span>", "", "right");
main = main.end;
//console.clear();
//console.log(main.optionList.Countdown$span_class$$beta$$$$span$$span_class$$sub$$$$span$.innerMenu.optionList.New_Years_Day.parent.parent.link)
}