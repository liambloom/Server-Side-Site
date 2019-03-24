function change() {
	//clear variables
	hexdec = undefined

	//red change
	if (changing[0] == "r") {
		if (changing[1] == "increase") {
			red++
			if (red.toString(16) == "ff") {
				changing = ["b", "decrease"]
			}
		} else if (changing[1] == "decrease") {
			red--
			if (red.toString(16) == "0") {
				changing = ["b", "increase"]
			}
		}
		hexred = red.toString(16)
		hexred = parseInt(hexred, 16)
	}

	//green change
	if (changing[0] == "g") {
		if (changing[1] == "increase") {
			green++
			if (green.toString(16) == "ff") {
				changing = ["r", "decrease"]
			}
		} else if (changing[1] == "decrease") {
			green--
			if (green.toString(16) == "0") {
				changing = ["r", "increase"]
			}
		}
		hexgreen = green.toString(16)
		hexgreen = parseInt(hexgreen, 16)			
	}

	//blue change
	if (changing[0] == "b") {
		if (changing[1] == "increase") {
			blue++
			if (blue.toString(16) == "ff") {
				changing = ["g", "decrease"]
			}
		} else if (changing[1] == "decrease") {
			blue--
			if (blue.toString(16) == "0") {
				changing = ["g", "increase"]
			}
		}
		hexblue = blue.toString(16)
		hexblue = parseInt(hexblue, 16)
}

	if (hexred <= 0xf) {
		hr = "0" + hexred.toString(16)
	} else {
		hr = hexred.toString(16) 
	}
	if (hexgreen <= 0xf) {
		hg = "0" + hexgreen.toString(16)
	} else {
		hg = hexgreen.toString(16) 
	}

	if (hexblue <= 0xf) {
		hb = "0" + hexblue.toString(16)
	} else {
		hb = hexblue.toString(16) 
	}


	//color change
	hexdec = "#" + hr + hg + hb
	return hexdec
}