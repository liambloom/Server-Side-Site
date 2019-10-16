function countdown() {
		var c
		var text
		var nextYear
		var days
		var daysLeft
		var MonthDays
		var monthlist
		var leap
		var hoursLeft
		var minutesLeft
		var secondsLeft
		var millisecondsLeft
		var i
			c = new Date()
			nextYear = c.getFullYear() + 1
			if (c.getFullYear() % 4 == 0 && ((c.gerFullYear() % 1000 == 0) != (c.GetFullYear() % 4000 == 0))) {
				days = 366
				leap = 1
			}else{
				days = 365
				leap = 0
			}
			MonthDays = 0
			monthlist = [0, 31, 28 + leap, 31 + leap, 30 + leap, 31 + leap, 30 + leap, 31 + leap, 31 + leap, 30 + leap, 31 + leap, 30 + leap]

			for(i = 0; i <= c.getMonth(); i++){
				MonthDays = MonthDays + monthlist[i] //problem is with monthdays
			}
			daysLeft = (days - (MonthDays + c.getDate())).toString(10)
			hoursLeft = ((24 - c.getHours()) - 1).toString(10)
			minutesLeft = ((60 - c.getMinutes()) - 1).toString(10)
			secondsLeft = ((60 - c.getSeconds()) - 1).toString(10)
			millisecondsLeft = (1000 - c.getMilliseconds()).toString(10)
			if (millisecondsLeft.length == 3) {
				millisecondsLeft = "." + millisecondsLeft
			}else if (millisecondsLeft.length == 2) {
				millisecondsLeft = "." + millisecondsLeft + "0"
			}else if (millisecondsLeft.length == 1) {
				millisecondsLeft = "." + millisecondsLeft + "00"
			}

			text = ""
			if (c.getMonth() == 0 && c.getDate() == 1){
				document.body.style.backgroundImage ="url('img/fireworks2.gif')";//https://giphy.com/gifs/fireworks-IjmMzurYulKEw/download
				document.getElementById("t").innerHTML = "Happy New Year"
			}else{
				document.body.style.backgroundImage ="url('img/Hourglass.gif')";//https://giphy.com/gifs/3ohhwlgaHwZ9zQ9HZS
				if(daysLeft > 0) {
					document.getElementById("daysNumber").innerHTML = daysLeft
					if(daysLeft == 1) {
						document.getElementById("daysLabel").innerHTML = "day "
					}else{
						document.getElementById("daysLabel").innerHTML = "days "
					}
				}
				if(hoursLeft > 0) {
					document.getElementById("hoursNumber").innerHTML = hoursLeft
					if(hoursLeft == 1) {
						document.getElementById("hoursLabel").innerHTML = "hour "
					}else{
						document.getElementById("hoursLabel").innerHTML = "hours "
					}
				}
				if(minutesLeft > 0) {
					document.getElementById("minutesNumber").innerHTML = minutesLeft
					if(minutesLeft == 1) {
						document.getElementById("minutesLabel").innerHTML = "minute "
					}else{
						document.getElementById("minutesLabel").innerHTML = "minutes "
					}
				}
				if(secondsLeft > 0 || millisecondsLeft > 0) {
					document.getElementById("secondsNumber").innerHTML = secondsLeft
					document.getElementById("millisecondsNumber").innerHTML = millisecondsLeft
					if(secondsLeft == 1 && millisecondsLeft == 0) {
						document.getElementById("secondsLabel").innerHTML = "second"
					}else{
						document.getElementById("secondsLabel").innerHTML = "seconds"
					}
				}
				document.getElementById("WhatYear").innerHTML = nextYear
				console.log("this ran")
			}
			
		}