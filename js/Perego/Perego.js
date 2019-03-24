//Created by Liam Bloom
//This makes it easier to create navigation bars, automatically adding all the css and html
//Embed with <script src="https://liambloom.github.io/lib/Perego/Perego.js"></script>
//jshint multistr: true, esversion: 5
function Menu(options, color) {//color of menu
	//console.log("hi")
	Object.defineProperties(this, {
		id: {
			value: "bar" + perego.counter.bar
		},
		color: {
			value: perego.validate.color(color)
		},
		optionList: {
			value: {},
			enumerable: true,
			writable: true
		},
		option: {
			set: function(option) {
				if (typeof option === "object") {
					if (option.constructor === Option) {
						option.parent = this;
						console.log("thing")
						if (!/^!/.test(option.link) && typeof this.parent !== "undefined") {
							option.link = option.link.replace(/^/, this.parent.parent.link.substring(0, this.parent.parent.link.lastIndexOf("/")));
							console.log(this.parent.parent.link.substring(0, this.parent.parent.link.lastIndexOf("/")));
							console.log("hi")
						}
						else {
							option.link = option.link.replace(/^!/, "");
							console.log("bar");
							console.log(!/^!/.test(option.link));
							console.log(/*typeof */this.pop/* !== "undefined"*/);
							console.log(this);
						}
						this.optionList[perego.validate.name(option.text)] = option;
					}
					else if (option[Object.keys(option)[0]].constructor === Option) {
						for (var i in option) {
							//if (i !== "all") {
								this.option = option[i];
							//}
						}
					}
					else {
						throw option + " is not an option";
					}
				}
				else {
					throw option + " is not an object";
				}
			}
		},
	});
	if (!perego.validate.main) {
		perego.css = perego.css;
		var hide = document.createElement("script");
		hide.id = "hideFunction";
		document.head.appendChild(hide);
		Object.defineProperties(this, {
			hide: {
				set: function(button) {
					if (button.constructor === Option){
						button.link = "function:document.getElementById('navigationBar').style.display = 'none'";
						this.option = button;
						delete this.hide;
					}
				}
			},
			end: {
				get: function() {
					var header = document.createElement("header");
					header.id = "navigationBar";
					//Maybe the webkit hack here, but I'll put it later
					document.body.appendChild(header);
					perego.menu(this, true);
					//console.log("Ran end")
					return this;
				}
			}
		});
	}
	if (Array.isArray(options)) {
		//console.log(options)
		if (Array.isArray(options[0])) {
			//console.log("options contains arrays")
			for (var i in options) {
				this.option = new Option(options[i][0], options[i][1], options[i][2], options[i][3]);

			}
		}
		else {
			//console.log("added new option")
			//console.log(options[0], options[1], options[2], options[3])

			this.option = new Option(options[0], options[1], options[2], options[3]);
		}
	}
	/*else {
		console.log(typeof options)
	}*/
}
function Option(text, link, location, /*super, sub, */color) {//href, innerHTML, float, color(if different from inherited)
	if (typeof link !== "string") {link = "/";}
	if (typeof text !== "string") {text = "Home";}
	//if (typeof note !== "string") {}
	Object.defineProperties(this, {
		text: {
			value: text
		},
		link: {
			value: link,
			writable: true
		},
		location: {
			value: perego.validate.location(location)
		},
		color: {
			value: perego.validate.color(color)
		},
		innerMenu: {
			set: function(menu) {
				if (menu.constructor === Menu) {
					menu.parent = this;
					menu.pop = 'hello';
					Object.defineProperty(this, "innerMenu", {
						value: menu
					});
					//this.innerMenu.parent = this;
				}
			},
			configurable: true
		}
	});
}
var perego = {
	version: "v1.1.1.0.0.31",
	logo: null,//I need to make one
	counter: {
		cssInternal: -1,//One less than the initial value because it will be ++ed
		cssnInternal: -1,
		barInternal: 0,
		get css() {
			this.cssInternal++;
			return this.cssInternal;
		},
		/*get css() {
			this.cssInternal++;
			return this.cssInternal;
		},*/
		get cssn() {
			this.cssnInternal++;
			return this.cssnInternal;
		},
		get bar() {
			this.barInternal++;
			return this.barInternal.toString();
		}
	},
	validate: {
		get main() {
			if (this.mainInternal) {
				return true;
			}
			else {
				this.mainInternal = true;
				return false;
			}
			
		},
		mainInternal: false,
		name: function(input) {
			return input.replace(/\s/gi, "_").replace(/^\d/i, "$").replace(/\W/gi, "$");
		},
		color: function(input) {
				if (!/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(input)) {
					console.warn("Warning: " + input + " is not a valid color");
					input = undefined;
				} 
				/*else if (!/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(color)) {
					color = undefined;
				}*/ 
				return input;
		},
		location: function(input, menu) {
			if (!/^(left|right|none|inherit)$/i.test(input) || menu === "vertical") {
				console.warn("Warning: " + input + " is not a valid location");//This is running when it shouldn't
				input = "none";
			}
			return input;
		},
		orientation: function(input) {
			if (!/^(vertical|horizontal)$/i.test(input)) {
				input = "vertical";
			}
			return input;
		}

	},
	/*theme: {
		get color() {
			//Yes, I borrowed many of these colors from sublime text 3
			return {
				red: "#f92472",
				orange: "#e79622",
				yellow: "#e7db74",
				green: "#a6e22b",
				blue: "#67d8ef",
				purple: "#ac80ff",
				white: "#f8f8f8",
				black: "181915"
			}
		}
		color: function() {
			for (var i in Object.keys(perego.theme.color)) {

			}
		}
	},*/
	set css(rule) {//What is the css to add 
		var node = document.createElement("style");
		node.id = "navBarCss" + this.counter.cssn;
		node.appendChild(document.createTextNode(""));//Webkit Hack
		document.head.appendChild(node);
		node = node.sheet;
		if (typeof rule === "string") {
			node.insertRule(rule, this.counter.css);
		}
		else if (typeof rule === "object") { 
			for (var i in rule) {
				//if (i !== "all") {
					//try {
					perego.css = rule[i];
					/*}
					catch(err) {
						console.error(err);
						console.error({rule: rule, i: i, rulei: rule[i]})
					} */
				//}
			}
		}
		else {
			throw rule + " is not a valid input";//Using throw will create an unrecoverable error and break the program
		}
		this.counter.cssInternal = -1;
	},
	get css() {//Make this with Object.defineProperties() and make crucial pieces of css "writeable: false"
		return {//add way to change just color scheme
		header:
			"header#navigationBar {\
				margin-bottom: 10px;\
				padding: 0px;\
				position: fixed;\
				left: 0px;\
				right: 0px;\
				top: 0px;\
			}",
		header_ul:
			"header#navigationBar ul {\
				list-style-type: none;\
				margin: 0;\
				padding: 0;\
				overflow: hidden;\
				background-color: #21242b\
			}",
		header_ul$horizontal_li:
			"header#navigationBar ul li {\
				float: left\
			}",
		header_ul$horizontal_li$right:
			"header#navigationBar ul li.right {\
				float: right\
			}",
		header_ul_li_a:
			"header#navigationBar ul li a {\
				display: block;\
				color: #67d8ef;\
				padding: 14px 16px;\
				text-decoration: none;\
			}",
		header_ul_li_a$main:
			"header#navigationBar ul li a.main {\
				text-align: center;\
			}",
		header_ul_li_a$hover:
			"header#navigationBar ul li a:hover {\
				background-color: #17181c;\
			}",
		header_ul_li_ul:
			"header#navigationBar ul li ul {\
				display: none;\
				position: fixed;\
			}",
		header_ul_li_ul_li:
			"header#navigationBar ul li ul li {\
				float: none\
			}",
		header_ul_li_a$hover$ul:
			"header#navigationBar ul li a:hover + ul {\
				display: initial;\
			}",
		header_ul_li_ul$hover:
			"header#navigationBar ul li ul:hover {\
				display: initial;\
			}"/*,
		header_span$super: 
			"header#navigationBar span.super {\
				vertical-align: super;\
				font-style: italic;\
			}"*/
		};
		/*header_colors:
			"header#navigationBar span.red{color: #f92472;}"*/
	},
	menu: function(menu, main) {//the menu object, is it the main menu and if not what is the id of the option it's in
		try {
			if (typeof menu !== "object" || menu.constructor !== Menu) {
				throw "up";// :P
			}
		}
		catch(err) {
			throw menu + "is not a menu";
		}
		var add = document.createElement("ul");
		add.id = perego.validate.name(menu.id);
		//add.className = menu.orientation;
		if (main === true) {
			add.className = "horizontal main";
			var parent = "navigationBar";
		}
		else if (typeof main === "string") {
			add.className = "vertical";
			var parent = main;
		}
		else {
			throw "I don't know where to put " + menu;
		}
		document.getElementById(parent).appendChild(add);
		if (typeof menu.color === "string") {//Can I put this before appendChild?
			document.getElementById(add.id).style.color = menu.color;
		}
		for (var i in menu.optionList) {
			//if (i !== "all") {
				perego.option(menu.optionList[i], menu.id);
			//}
		}
		//console.log("Ran perego.menu()")
	},
	option: function(option, menu) {
		try {
			if (typeof option !== "object" || option.constructor !== Option) {
				throw "up";// :P
			}
		}
		catch(err) {
			throw menu + "is not an option";
		}
		var addShell = document.createElement("li");
		addShell.id = "shell" + perego.validate.name(option.text);
		addShell.className = option.location;
		document.getElementById(menu).appendChild(addShell);
		var add = document.createElement("a");
		add.id = perego.validate.name(option.text);
		
		if (!/^function:/.test(option.link)) {
			add.href = option.link;
		}
		document.getElementById(addShell.id).appendChild(add);
		document.getElementById(add.id).innerHTML = option.text;
		if (/^function:/.test(option.link)){//There must be a better way to do this//This must be AFTER I create the hide button
			//console.log("Will run");
			var click = document.createElement("script");
			//console.log("Ran line 1");
			click.id = add.id + "onClickFunction";
			//console.log("Ran line 2");
			document.head.appendChild(click);
			//console.log("Ran line 3");
			document.getElementById(click.id).innerHTML = "document.getElementById('" + add.id + "').onclick = function() {" + option.link.replace(/^function:/, "") + "};";
			//console.log("Ran line 4");
		}
		if (typeof option.color === "string") {//Can I put this before appendChild?
			document.getElementById(add.id).style.color = option.color;
		}
		if (typeof option.innerMenu === "object") {
			perego.menu(option.innerMenu, addShell.id);
		}
		//console.log("Ran perego.option()")
	}
};