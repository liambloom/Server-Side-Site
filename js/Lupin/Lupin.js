//Created by Liam Bloom
//Embed with <script src="https://liambloom.github.io/lib/Lupin/Lupin.js"></script>
var lupin = {
	version: "v1.3.1.2.0.3.14",
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
			var elem = lupin.dom.id(e);
			elem.parentNode.removeChild(elem);
    		return elem;
		},
		add: function(e) {
			return document.appendChild(e);
		}, 
		remove: function(e) {
			return document.removeChild(e);
		},
		replace: function(e) {
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
	}
};
//some of these are from keycode.info thanks to Wes Bos
var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
lupin.key.list[0] = /null|nothing/i;
lupin.key.list[3] = /break/i;
lupin.key.list[8] = /backspace/i;
lupin.key.list[9] = /tab/i;
lupin.key.list[13] = /enter/i;
lupin.key.list[16] = /shift/i;
lupin.key.list[17] = /ctrl|control/i;
lupin.key.list[18] = /alt/i;
lupin.key.list[19] = /pause|break/i;
lupin.key.list[20] = /caps lock/i;
lupin.key.list[21] = /hangul/i;//Korean
lupin.key.list[25] = /hanga/i;//Chinese Characters in Korean
lupin.key.list[27] = /escape|esc/i;
lupin.key.list[28] = /conversion/i;
lupin.key.list[29] = /non-conversion/i;
lupin.key.list[32] = /space| /i;
lupin.key.list[33] = /page up/i;
lupin.key.list[34] = /page down/i;
lupin.key.list[35] = /end/i;
lupin.key.list[36] = /home/i;
lupin.key.list[37] = /left arrow/i;
lupin.key.list[38] = /up arrow/i;
lupin.key.list[39] = /right arrow/i;
lupin.key.list[40] = /down arrow/i;
lupin.key.list[41] = /select/i;
lupin.key.list[42] = /print|ctrl\+p/i;
lupin.key.list[43] = /execute/i;
lupin.key.list[44] = /PrtSc|(Print Screen)/i;
lupin.key.list[45] = /insert/i;
lupin.key.list[46] = /delete/i;
lupin.key.list[47] = /help/i;
lupin.key.list[58] = /colin|:/i;
lupin.key.list[60] = /(less than)|</i;
lupin.key.list[63] = /eszett|ß/i;
lupin.key.list[95] = /sleep/i;
lupin.key.list[106] = /multiply|\*/i;
lupin.key.list[107] = /add|\+/i;
lupin.key.list[110] = /(decimal point)|\./i;
lupin.key.list[111] = /divide|\//i;
lupin.key.list[144] = /num lock/i;
lupin.key.list[145] = /scroll lock/i;
lupin.key.list[160] = /\^/i;
lupin.key.list[161] = /\!/i;
lupin.key.list[162] = /؛|(arabic semicolin)|(arabic semi-colin)|(arabic ;)/i;
lupin.key.list[163] = /hash|hashtag|hex|octothorp|octothorpe|octatorp|octatherp|sharp|#/i;
lupin.key.list[164] = /dollar|(dollar sign)|\$/i;
lupin.key.list[165] = /ù/i;
lupin.key.list[166] = /(page back)|(page backward)/i;
lupin.key.list[167] = /page forward/i;
lupin.key.list[168] = /refresh|reload/i;
lupin.key.list[169] = /(closing paren)|AZERTY/i;
lupin.key.list[170] = /star|asterisk|\*/i;
lupin.key.list[171] = /~|\+|\*/i;
lupin.key.list[172] = /home/i;
lupin.key.list[176] = /next/i;
lupin.key.list[177] = /previous/i;
lupin.key.list[178] = /stop/i;
lupin.key.list[179] = /play|pause/i;
lupin.key.list[180] = /email|e-mail/i;
lupin.key.list[187] = /equal sign/i;
lupin.key.list[188] = /comma/i;
lupin.key.list[189] = /dash/i;
lupin.key.list[190] = /period|\./i;
lupin.key.list[191] = /forward slash|ç/i;
//lupin.key.list[192] = /(grave accent)|grave|ñ|æ|ö/i;
lupin.key.list[192] = /backquote|`/i;
lupin.key.list[193] = /\?|,|\/|°/i;
lupin.key.list[219] = /(backslash)|(back slash)|\\|(open bracket)|\[/i;//Why are these the same?
lupin.key.list[220] = /(backslash)|(back slash)|\\|(open bracket)|\[/i;//Why are these the same?
lupin.key.list[221] = /(close bracket)|\]|å/i;
lupin.key.list[222] = /(single quote)|'|ø|ä/i;
lupin.key.list[223] = /`/i;
lupin.key.list[225] = /altgr/i;
lupin.key.list[226] = /(< \/git>)|(left (backslash|back slash|\\))/
lupin.key.list[230] = /GNOME Compose Key/i;
lupin.key.list[231] = /ç/i;
lupin.key.list[233] = /XF86Forward/i;
lupin.key.list[234] = /XF86Back/i;
lupin.key.list[235] = /non-conversion/i;
lupin.key.list[240] = /alphanumeric/i;
lupin.key.list[242] = /hiragana|katakana/i;
lupin.key.list[243] = /half-width|full-width/i;
lupin.key.list[244] = /kanji/i;
lupin.key.list[255] = /toggle touchpad/i;
//For Loops
for (var i = 48; i <= 57; i++) {//numbers
	lupin.key.list[i] = new RegExp((i - 48).toString(), "i");//Regular
	lupin.key.list[i+48] = new RegExp("numpad " + (i - 48).toString(), "i");//Numpad
}
for (var i = 65; i <= 90; i++) {//letters
	lupin.key.list[i] = new RegExp(alphabet[i - 65], "i");
}
for (var i = 112; i <= 135; i++) {//f
	lupin.key.list[i] = new RegExp("f" + (i - 111).toString(), "i");
}
//Browser if statements
if (lupin.browser.is("Firefox")){
	lupin.key.list[59] = /semicolin|semi-colin|;/i;
	lupin.key.list[61] = /equals|equal|=/i;
	lupin.key.list[64] = /at|@/i;
	lupin.key.list[108] = /numpad (period|\.)/
	lupin.key.list[173] = /subract|minus|-/i;
	lupin.key.list[181] = /mute|unmute/i;
	lupin.key.list[182] = /(decrease volume)|(volume down)/i;
	lupin.key.list[183] = /(increase volume)|(volume up)/i;
}
else {
	lupin.key.list[59] = /equals|equal|=/i;
	lupin.key.list[109] = /subtract|minus|-/i;
	lupin.key.list[173] = /mute|unmute/i;
	lupin.key.list[174] = /(decrease volume)|(volume down)/i;
	lupin.key.list[175] = /(increase volume)|(volume up)/i;
	lupin.key.list[186] = /semi-colin|semicolin|;|ñ/i;
	if (lupin.browser.is("Chrome")) {
		lupin.key.list[194] = /numpad (period|\.)/i;
	}
}
if (lupin.browser.is("Chrome") || lupin.browser.is("Edge")) {
	lupin.key.list[251] = /unlock trackpad/i;
}
//OS if statements
if (lupin.browser.is("Windows")) {
	lupin.key.list[91] = /left (window|(window key)|(windows key))/i;
	lupin.key.list[92] = /right (window|(window key)|(windows key))/i;
	lupin.key.list[93] = /select|menu/i;
}
else if (lupin.browser.is("MacOS")) {
	lupin.key.list[91] = /left (⌘|cmnd|command|(cmnd key)|(command key))/i;
	lupin.key.list[93] = /select|right (⌘|cmnd|command|(cmnd key)|(command key))/i;
}
else if (lupin.browser.is("ChromeOS")) {
	lupin.key.list[91] = /search/i;
}
//Other
if (lupin.browser.is("Firefox") && lupin.browser.is("MacOS")) {
	lupin.key.list[224] = /⌘|cmnd|command|(cmnd key)|(command key)/i;
}