function slash(input){
		var output
		var cheats = {
			u: {
				set enabled(setTo) {
					var v = strToBool(setTo)
					if (v == undefined) {
						v = stateinfo.cheatsEnabled
					}
					stateinfo.cheatsEnabled = v
					if (v) {
						output = "Cheats Enabled"
					}
					else if (!v) {
						output = "Cheats Disabled"
					}
					else {
						output = "Error: " + this + " could not be set to " + v
					}
				},
				help: function initiateHelp() {
					stateinfo.stateChange = "help:commands"
					hash("#help:commands")
				},
				enable_cheats: function chEn() {
					//console.log(this)
					this.enabled = "true"
				},
				disable_cheats: function chDi() {
					this.enabled = "false"
				}
			},
			test: 10,
			ftest: function testFun() {
				output = "ftest ran"
			},
			get theThing() {
				stateinfo.state
			}	
		}
		/*for (var cheatHandler = input.toLowerCase(); cheatHandler.includes(" ");) {
			cheatHandler = cheatHandler.replace(" ", "")
		}*/
		var cheatHandler = input.toLowerCase().replace(/ /g, "")
		try{
			if (cheatHandler.includes("=")){
				cheatHandler = cheatHandler.split("=")
				cheatHandler[0] = cheatHandler[0].split(".")
				switch (cheatHandler[0].length) {
					case 1:
						cheats[cheatHandler[0][0].replace("/", "")] = cheatHandler[1]
						break;
					case 2:
						cheats[cheatHandler[0][0].replace("/", "")][cheatHandler[0][1]] = cheatHandler[1]
						break;
				}
			}
			else if (cheatHandler.includes("/get")) {
				cheatHandler = cheatHandler.split(".")
				switch (cheatHandler.length) {
					case 1:
						output = cheats[cheatHandler[0].replace("/get", "")].toString()
						break;
					case 2:
						output = cheats[cheatHandler[0].replace("/get", "")][cheatHandler[1]].toString()
						break;
				}
			}
			else if (cheatHandler.includes("(")) {
				cheatHandler = cheatHandler.split("(")
				cheatHandler[0] = cheatHandler[0].split(".")
				switch (cheatHandler[0].length) {
					case 1:
						cheats[cheatHandler[0][0].replace("/", "")](cheatHandler[1].replace(")", ""))
						break;
					case 2:
						cheats[cheatHandler[0][0].replace("/", "")][cheatHandler[0][1]](cheatHandler[1].replace(")", ""))
						break;
				}
			}
			else {
				cheatHandler = cheatHandler.split(".")
				switch (cheatHandler.length) {
					case 1:
						cheats[cheatHandler[0].replace("/", "")]()
						break;
					case 2:
						cheats[cheatHandler[0].replace("/", "")][cheatHandler[1]]()
						break;
				}
			}
		}
		catch(err){
			output = "That cheat does not exist<br>\
			Try \"/u.help\""
		}
		return output
}