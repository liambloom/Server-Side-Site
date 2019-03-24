//Created by Liam Bloom
//Embed with <script src="https://liambloom.github.io/lib/Lupin/Lupin.js"></script>
var lupinb = {
	version: "&beta;1.4.1.0.0.8",//version
	alphabet: "abcdefghijklmnopqrstuvwxyz".split(""),
	dom: {
		id: function(e) {
			return document.getElementById(e);
		},
		class: function(e) {
			return document.getElementsByClassName(e);
		},
		tag: function(e) {
			return document.getElementsByTagName(e);
		},
		name: function(e) {
			return document.getElementsByName(e);
		},
		create: function(e) {
			return document.createElement(e);
		},
		destroy: function(e) {//thanks to catalin.red for this code
			var elem = lupinb.dom.id(e);
			elem.parentNode.removeChild(elem);
    		return elem;
		},
		add: function(e) {
			//return document.appendChild(e);
			lupinb.dom.id(e).parentNode.removeChild(lupinb.dom.id(e))
			return lupinb.dom.id(e)
		}, 
		/*remove: function(e) {
			return document.removeChild(e);
		},*/
		replace: function(e) {//um...
			return document.replaceChild(e);
		},
	},
	key: {
		list: new Array(255),
		check: function(key, target) {
			if (this.list.indexOf(target) == key) {
				return true;
			}
			else {
				return false;
			}
		},
		code: function(key) {
			return this.list.indexOf(key);
		}
	},
	browser: {//Supports Chrome/Dolphin, Firefox, UC, Opera, IE, Samsung, Edge, ASOP Browser, Yandex, Chromium, Blackberry Browser
		get ua() {
			return window.navigator.userAgent;
		},
		get which() {
			if (/(?=.*Chrome)(?!(.*Chromium|.*OPR|.*SamsungBrowser|.*Edge|.*YaBrowser))/im.test(this.ua)) {//Chrome or Dolphin (Identical user agents)
				return /Chrome/i;
			}	
			else if (/(?=.*Safari)(?=(.*iPhone|.*iPad|.*Mac))(?!(.*Chromium|.*OPR|.*Edge|.*UCBrowser))/im.test(this.ua)) {//Safari !UNTESTED
				return /Safar/i;
			}
			else if (/Firefox/im.test(this.ua)) {//Firefox
				return /Firefox/i;
			}
			else if (/UCBrowser/im.test(this.ua)) {//UC !UNTESTED
				return /UCBrowser/i;
			}
			else if (/Opera|OPR|OPiOS/im.test(this.ua)) {//Opera (Opera is true for old versions of opera, opr for new versions, and opios for ios versions)
				return /Opera/i;
			}
			else if (/((?=.*Trident)(?!.*MSIE))|MSIE/im.test(this.ua)) {//IE !Only tested for IE11
				return /IE/i;
			}
			else if (/SamsungBrowser/im.test(this.ua)) {//Samsung Browser
				return /Samsung Internet/i;
			}
			else if (/Edge/im.test(this.ua)) {//Edge
				return /Edge/i;
			}
			else if (/(?=.*Safari)(?=.*Linux)(?=.*Android)(?!.*Chrome)/im.test(this.ua)) {//Android Browser
				return /AOSPBrowser/i;//AOSP = Android Open Source Project
			}
			else if (/YaBrowser/im.test(this.ua)) {//Yandex
				return /Yandex/i;
			}
			else if (/Chromium/im.test(this.ua)) {//Chromium
				return /Chromium/i;
			}
			/*else if (/(?=.*Safari)(?=.*Chrome)(?=.*Linux)(?=.*Android)/im.test(this.ua)) {//Dolphin
				return /Dolphin/
			}*/
			else if (/BlackBerry|BB/im.test(this.ua)) {//Blackberry Browser
				return /BlackBerry/i
			}
			else {
				return /Other/i;
			}
		},
		get engine() {
			if (/AppleWebKit/im.test(this.ua)) {//Most Browsers
				return /Webkit/i;
			}
			else if (/Gecko/im.test(this.ua) && !/like Gecko/im.test(this.ua)) {//Firefox (if lookbehinds were supported in js I would use /(?<!like) Gecko/im.test(this.ua))
				return /Gecko/i;
			}
			else if (/Trident/im.test(this.ua)) {//IE
				return /Trident/i;
			}
			else if (/Presto/im.test(this.ua)) {//Older versions of Opera
				return /Presto/i;
			}
			else {
				return /Other/i;
			}
		},
		is: function(target) {
			if (this.which.test(target) || this.engine.test(target) || this.os.test(target)) {
				return true;
			}
			else {
				return false;
			}
		},
		supports: function(func) {
			if (typeof(func) !== "undefined") {
				return true;
			}
			else {
				return false;
			}
		},
		get lang() {
			return window.navigator.langthis.uage.split("-");
		},
		get os() {
			if (/Windows/im.test(this.ua)) {//Windows
				return /Windows/i;
			}
			else if (/MacOS/im.test(this.ua)) {//MacOS
				return /MacOS/i;
			}
			else if (/CrOS/im.test(this.ua)) {//ChromeOS
				return /ChromeOS/i;
			}
			else if (/Android/im.test(this.ua)) {//Android
				return /Android/i;
			}
			else if (/iPad|iPhone/im.test(this.ua)) {//iOS
				return /iOS/i;
			}
			else if (/Linux/im.test(this.ua)) {//Linux
				return /Linux/i;
			}
			else if (/X11/im.test(this.ua)) {//UNIX
				return /UNIX/i;
			}
			else {
				return /Other/i;
			}
		}
	},
	random: {
		number: function(min, max) {
			return min + Math.round(Math.random() * (max - min))
		},
		get color() {
			var col = "#"
			for (var i = 0; i < 6; i++) {
				col += this.number(0x0, 0xf).toString(16)
			}
			return col
		},
		get letter() {
			return lupinb.alphabet[this.number(0, 25)]
		}
	},
	date: {
		findDay: function(dayToFind, th) {

		}
	}

};
//some of these are from keycode.info thanks to Wes Bos
//var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
lupinb.key.list[0] = /null|nothing/i;
lupinb.key.list[3] = /break/i;
lupinb.key.list[8] = /backspace/i;
lupinb.key.list[9] = /tab/i;
lupinb.key.list[13] = /enter/i;
lupinb.key.list[16] = /shift/i;
lupinb.key.list[17] = /ctrl|control/i;
lupinb.key.list[18] = /alt/i;
lupinb.key.list[19] = /pause|break/i;
lupinb.key.list[20] = /caps lock/i;
lupinb.key.list[21] = /hangul/i;//Korean
lupinb.key.list[25] = /hanga/i;//Chinese Characters in Korean
lupinb.key.list[27] = /escape|esc/i;
lupinb.key.list[28] = /conversion/i;
lupinb.key.list[29] = /non-conversion/i;
lupinb.key.list[32] = /space| /i;
lupinb.key.list[33] = /page up/i;
lupinb.key.list[34] = /page down/i;
lupinb.key.list[35] = /end/i;
lupinb.key.list[36] = /home/i;
lupinb.key.list[37] = /left arrow/i;
lupinb.key.list[38] = /up arrow/i;
lupinb.key.list[39] = /right arrow/i;
lupinb.key.list[40] = /down arrow/i;
lupinb.key.list[41] = /select/i;
lupinb.key.list[42] = /print|ctrl\+p/i;
lupinb.key.list[43] = /execute/i;
lupinb.key.list[44] = /PrtSc|(Print Screen)/i;
lupinb.key.list[45] = /insert/i;
lupinb.key.list[46] = /delete/i;
lupinb.key.list[47] = /help/i;
lupinb.key.list[58] = /colin|:/i;
lupinb.key.list[60] = /(less than)|</i;
lupinb.key.list[63] = /eszett|ß/i;
lupinb.key.list[95] = /sleep/i;
lupinb.key.list[106] = /multiply|\*/i;
lupinb.key.list[107] = /add|\+/i;
lupinb.key.list[110] = /(decimal point)|\./i;
lupinb.key.list[111] = /divide|\//i;
lupinb.key.list[144] = /num lock/i;
lupinb.key.list[145] = /scroll lock/i;
lupinb.key.list[160] = /\^/i;
lupinb.key.list[161] = /\!/i;
lupinb.key.list[162] = /؛|(arabic semicolin)|(arabic semi-colin)|(arabic ;)/i;
lupinb.key.list[163] = /hash|hashtag|hex|octothorp|octothorpe|octatorp|octatherp|sharp|#/i;
lupinb.key.list[164] = /dollar|(dollar sign)|\lupinb/i;
lupinb.key.list[165] = /ù/i;
lupinb.key.list[166] = /(page back)|(page backward)/i;
lupinb.key.list[167] = /page forward/i;
lupinb.key.list[168] = /refresh|reload/i;
lupinb.key.list[169] = /(closing paren)|AZERTY/i;
lupinb.key.list[170] = /star|asterisk|\*/i;
lupinb.key.list[171] = /~|\+|\*/i;
lupinb.key.list[172] = /home/i;
lupinb.key.list[176] = /next/i;
lupinb.key.list[177] = /previous/i;
lupinb.key.list[178] = /stop/i;
lupinb.key.list[179] = /play|pause/i;
lupinb.key.list[180] = /email|e-mail/i;
lupinb.key.list[187] = /equal sign/i;
lupinb.key.list[188] = /comma/i;
lupinb.key.list[189] = /dash/i;
lupinb.key.list[190] = /period|\./i;
lupinb.key.list[191] = /forward slash|ç/i;
//lupinb.key.list[192] = /(grave accent)|grave|ñ|æ|ö/i;
lupinb.key.list[192] = /backquote|`/i;
lupinb.key.list[193] = /\?|,|\/|°/i;
lupinb.key.list[219] = /(backslash)|(back slash)|\\|(open bracket)|\[/i;//Why are these the same?
lupinb.key.list[220] = /(backslash)|(back slash)|\\|(open bracket)|\[/i;//Why are these the same?
lupinb.key.list[221] = /(close bracket)|\]|å/i;
lupinb.key.list[222] = /(single quote)|'|ø|ä/i;
lupinb.key.list[223] = /`/i;
lupinb.key.list[225] = /altgr/i;
lupinb.key.list[226] = /(< \/git>)|(left (backslash|back slash|\\))/
lupinb.key.list[230] = /GNOME Compose Key/i;
lupinb.key.list[231] = /ç/i;
lupinb.key.list[233] = /XF86Forward/i;
lupinb.key.list[234] = /XF86Back/i;
lupinb.key.list[235] = /non-conversion/i;
lupinb.key.list[240] = /alphanumeric/i;
lupinb.key.list[242] = /hiragana|katakana/i;
lupinb.key.list[243] = /half-width|full-width/i;
lupinb.key.list[244] = /kanji/i;
lupinb.key.list[255] = /toggle touchpad/i;
//For Loops
for (var i = 48; i <= 57; i++) {//numbers
	lupinb.key.list[i] = new RegExp((i - 48).toString(), "i");//Regular
	lupinb.key.list[i+48] = new RegExp("numpad " + (i - 48).toString(), "i");//Numpad
}
for (var i = 65; i <= 90; i++) {//letters
	lupinb.key.list[i] = new RegExp(lupinb.alphabet[i - 65], "i");
}
for (var i = 112; i <= 135; i++) {//f
	lupinb.key.list[i] = new RegExp("f" + (i - 111).toString(), "i");
}
//Browser if statements
if (lupinb.browser.is("Firefox")){
	lupinb.key.list[59] = /semicolin|semi-colin|;/i;
	lupinb.key.list[61] = /equals|equal|=/i;
	lupinb.key.list[64] = /at|@/i;
	lupinb.key.list[108] = /numpad (period|\.)/
	lupinb.key.list[173] = /subract|minus|-/i;
	lupinb.key.list[181] = /mute|unmute/i;
	lupinb.key.list[182] = /(decrease volume)|(volume down)/i;
	lupinb.key.list[183] = /(increase volume)|(volume up)/i;
}
else {
	lupinb.key.list[59] = /equals|equal|=/i;
	lupinb.key.list[109] = /subtract|minus|-/i;
	lupinb.key.list[173] = /mute|unmute/i;
	lupinb.key.list[174] = /(decrease volume)|(volume down)/i;
	lupinb.key.list[175] = /(increase volume)|(volume up)/i;
	lupinb.key.list[186] = /semi-colin|semicolin|;|ñ/i;
	if (lupinb.browser.is("Chrome")) {
		lupinb.key.list[194] = /numpad (period|\.)/i;
	}
}
if (lupinb.browser.is("Chrome") || lupinb.browser.is("Edge")) {
	lupinb.key.list[251] = /unlock trackpad/i;
}
//OS if statements
if (lupinb.browser.is("Windows")) {
	lupinb.key.list[91] = /left (window|(window key)|(windows key))/i;
	lupinb.key.list[92] = /right (window|(window key)|(windows key))/i;
	lupinb.key.list[93] = /select|menu/i;
}
else if (lupinb.browser.is("MacOS")) {
	lupinb.key.list[91] = /left (⌘|cmnd|command|(cmnd key)|(command key))/i;
	lupinb.key.list[93] = /select|right (⌘|cmnd|command|(cmnd key)|(command key))/i;
}
else if (lupinb.browser.is("ChromeOS")) {
	lupinb.key.list[91] = /search/i;
}
//Other
if (lupinb.browser.is("Firefox") && lupinb.browser.is("MacOS")) {
	lupinb.key.list[224] = /⌘|cmnd|command|(cmnd key)|(command key)/i;
}