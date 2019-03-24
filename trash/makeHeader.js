function makeHeader(){
	document.write(`
	<script src="https://liambloom.github.io/Countdown/js/findDay.js"></script>
	<script src="https://liambloom.github.io/Countdown/js/findYear.js"></script>
	<script src="https://liambloom.github.io/Countdown/js/findLast.js"></script>
	<style>
		header.header{
			position: fixed;
			top: 0px;
			left: 0px;
			right: 0px;
			margin: 0px;
			padding: 20px 50px;
			color: #67d8ef;
			background-color: #282923;
			width: 100%;
		}
		h1.header{
			margin-top: 0px;
			font-style: italic;
			font-weight: bolder;
			font-size: 50px;
			font-family: Arial, Helvetica, sans-serif;
		}
		table.header, th.header, tr.header, td.header{
			text-align: left;
			border: 2px solid transparent;
			border-collapse: collapse;
			padding: 15px;
		}
		td.header{
			vertical-align: top;
		}
		div.dropdowntableheader{
			padding: 0px;
			padding-right: none;
			/*width: 100px;*/
			display: inline-flex;
			position: relative;
		}
		a.header{
			color: #67d8ef;
			text-decoration: none;
		}
		.menuOptionHeader{
			display: none;
		}
		span.super{
			vertical-align: super;
			font-style: italic;
			color: #e79622;
		}
		#headerRemove{
			/*float: right;*/
			position: fixed;
			right: 20px;
			background: transparent;
			width: 20px;
			height: 20px;
		}
	</style>
<!--</head>
<body>-->
	<header class="header">
		<h1 class="header"><span style="vertical-align: super;">LIAM</span><span class="super" style="vertical-align: sub;">BLOOM</span></h1>
			<div class="dropdowntableheader">
					<table class="header" id="mainMenu" onmouseover="show(this.id)" onmouseout="hide(this.id)">
						<tr class="header">
							<th class="header">
								<a class="header" href="https://liambloom.github.io/index.html">Main</a>
							</th>
						</tr>
						<tr class="header menuOptionHeader mainMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/MagicEight.html">Magic Eight Ball</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader mainMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/RandomColor.html">Random Color</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader mainMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/GradientColor.html">Gradient Color</a>
							</td>
						</tr>
					</table>
				</div>
				<div class="dropdowntableheader">
					<table class="header" id="countdownMenu" onmouseover="show(this.id)" onmouseout="hide(this.id)">
						<tr class="header">
							<th class="header">
								<a class="header" href="https://liambloom.github.io/Countdown/index.html">Countdown</a>
							</th>
						</tr>
						<tr class="header menuOptionHeader countdownMenu">
							<td class="header">
								<a class="header" id="HeaderNewYearsDay">New Years Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderMartinLutherKingJrDay">Martin Luther King Jr. Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader countdownMenu">
							<td class="header">
								<a class="header" id="HeaderGeorgeWashingtonsBirthday">George Washington's Birthday</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderMemorialDay">Memorial Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader countdownMenu">
							<td class="header">
								<a class="header" id="HeaderIndependenceDay">Independence Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderLaborDay">Labor Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader countdownMenu">
							<td class="header">
								<a class="header" id="HeaderColumbusDay">Columbus Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderVeteransDay">Veterans Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader countdownMenu">
							<td class="header">
								<a class="header" id="HeaderThanksgivingDay">Thanksgiving Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderChristmasDay">Christmas Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader countdownMenu">
							<td class="header">
								<a class="header" id="HeaderTest">Test</a>
							</td>
						</tr>
					</table>
				</div>
				<div class="dropdowntableheader">
					<table class="header" id="betacountdownMenu" onmouseover="show(this.id)" onmouseout="hide(this.id)">
						<tr class="header">
							<th class="header">
								<a class="header" href="https://liambloom.github.io/Countdown/beta.html">Countdown<span class="super">beta</span></a>
							</th>
						</tr>
						<tr class="header menuOptionHeader betacountdownMenu">
							<td class="header">
								<a class="header" id="HeaderNewYearsDaybeta">New Years Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderMartinLutherKingJrDaybeta">Martin Luther King Jr. Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader betacountdownMenu">
							<td class="header">
								<a class="header" id="HeaderGeorgeWashingtonsBirthdaybeta">George Washington's Birthday</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderMemorialDaybeta">Memorial Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader betacountdownMenu">
							<td class="header">
								<a class="header" id="HeaderIndependenceDaybeta">Independence Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderLaborDaybeta">Labor Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader betacountdownMenu">
							<td class="header">
								<a class="header" id="HeaderColumbusDaybeta">Columbus Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderVeteransDaybeta">Veterans Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader betacountdownMenu">
							<td class="header">
								<a class="header" id="HeaderThanksgivingDaybeta">Thanksgiving Day</a>
							</td>
							<td class="header">
								<a class="header" id="HeaderChristmasDaybeta">Christmas Day</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader betacountdownMenu">
							<td class="header">
								<a class="header" id="HeaderTestbeta">Test</a>
							</td>
						</tr>
					</table>
				</div>
				<div class="dropdowntableheader">
					<table class="header" id="schoolMenu" onmouseover="show(this.id)" onmouseout="hide(this.id)">
						<tr class="header">
							<th class="header">
								<a class="header" href="https://liambloom.github.io/school/index.html">School</a>
							</th>
						</tr>
						<tr class="header menuOptionHeader schoolMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/school/SocialStudiesProject.html">Ancient Egyptian Social Class Project</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader schoolMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/school/ScienceVocab.html">Science Vocab</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader schoolMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/school/ELAgreekMythologyScript.html">Greek Mythology Play Script</a>
							</td>
						</tr>
						<tr class="header menuOptionHeader schoolMenu">
							<td class="header">
								<a class="header" href="https://liambloom.github.io/school/ScratchPrometheus.html">Prometheus Cartoon</a>
							</td>
						</tr>
					</table>
				</div>
				<div id="headerRemove" onclick="document.getElementsByTagName('header')[0].style.display = 'none'">
					<!--⮵-->A
				</div>
	</header>
	<script>
		function show(name) {
			var l = document.getElementsByClassName(name);
			for(var i=0; i<l.length; i++){
				l[i].style.display = "inherit"; //visibility = "visible"
			}
		}
		function hide(name) {
			var l = document.getElementsByClassName(name);
			for(var i=0; i<l.length; i++){
				l[i].style.display = "none"; //visibility = "collapse"
			}
		}
		var n = new Date();
		document.getElementById("HeaderNewYearsDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 0) + "-01-01&4=" + findYear(n.getFullYear(), n.getMonth(), 0) + "&5=Happy+New+Year";
		document.getElementById("HeaderMartinLutherKingJrDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 0) + "-01-" + findDay(findYear(n.getFullYear(), n.getMonth(), 0), 0, 1, 3) + "&4=Martin+Luther+King+Jr.+Day&5=Happy+Martin+Luther+King+Jr.+Day";
		document.getElementById("HeaderGeorgeWashingtonsBirthday").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 1) + "-02-" + findDay(findYear(n.getFullYear(), n.getMonth(),  1), 1, 1, 3) + "&4=Presidents'+Day&5=Happy+Presidents'+Day";
		document.getElementById("HeaderMemorialDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 4) + "-05-" + findLast(findYear(n.getFullYear(), n.getMonth(), 4), 4, 1) + "&4=Memorial+Day&5=Never+Forget&6=flag";
		document.getElementById("HeaderIndependenceDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 6) + "-07-04&4=Independence+Day&5=Happy+Independence+Day";
		document.getElementById("HeaderLaborDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 8) + "-09-" + findDay(findYear(n.getFullYear(), n.getMonth(), 8), 8, 1, 1) + "&4=Labor+Day&5=Happy+Labor+Day";
		document.getElementById("HeaderColumbusDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 9) + "-10-" + findDay(findYear(n.getFullYear(), n.getMonth(), 9), 9, 1, 2) + "&4=Columbus+Day&5=Happy+Columbus+Day&6=ship";
		document.getElementById("HeaderVeteransDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 10) + "-11-11&4=Veterans+Day&5=Never+Forget&6=flag";
		document.getElementById("HeaderThanksgivingDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 10) + "-11-" + findDay(findYear(n.getFullYear(), n.getMonth, 10), 10, 4, 4) + "&4=Thanksgiving&5=Happy+Thanksgiving&6=turkey";
		document.getElementById("HeaderChristmasDay").href = "https://liambloom.github.io/Countdown/index.html?0=" + findYear(n.getFullYear(), n.getMonth(), 11) + "-12-25&4=Christmas&5=Merry+Christmas&6=christmasTree";
		document.getElementById("HeaderTest").href = "https://liambloom.github.io/Countdown/index.html?0=" + n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate() + "&1=" + n.getHours() + ":" + n.getMinutes() + "&2=" + (n.getSeconds() + 15) + "&4=Results&5=Now";
		document.getElementById("HeaderNewYearsDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 0) + "-01-01&4=" + findYear(n.getFullYear(), n.getMonth(), 0) + "&5=Happy+New+Year";
		document.getElementById("HeaderMartinLutherKingJrDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 0) + "-01-" + findDay(findYear(n.getFullYear(), n.getMonth(), 0), 0, 1, 3) + "&4=Martin+Luther+King+Jr.+Day&5=Happy+Martin+Luther+King+Jr.+Day";
		document.getElementById("HeaderGeorgeWashingtonsBirthdaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 1) + "-02-" + findDay(findYear(n.getFullYear(), n.getMonth(),  1), 1, 1, 3) + "&4=Presidents'+Day&5=Happy+Presidents'+Day";
		document.getElementById("HeaderMemorialDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 4) + "-05-" + findLast(findYear(n.getFullYear(), n.getMonth(), 4), 4, 1) + "&4=Memorial+Day&5=Never+Forget&6=flag";
		document.getElementById("HeaderIndependenceDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 6) + "-07-04&4=Independence+Day&5=Happy+Independence+Day";
		document.getElementById("HeaderLaborDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 8) + "-09-" + findDay(findYear(n.getFullYear(), n.getMonth(), 8), 8, 1, 1) + "&4=Labor+Day&5=Happy+Labor+Day";
		document.getElementById("HeaderColumbusDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 9) + "-10-" + findDay(findYear(n.getFullYear(), n.getMonth(), 9), 9, 1, 2) + "&4=Columbus+Day&5=Happy+Columbus+Day&6=ship";
		document.getElementById("HeaderVeteransDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 10) + "-11-11&4=Veterans+Day&5=Never+Forget&6=flag";
		document.getElementById("HeaderThanksgivingDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 10) + "-11-" + findDay(findYear(n.getFullYear(), n.getMonth, 10), 10, 4, 4) + "&4=Thanksgiving&5=Happy+Thanksgiving&6=turkey";
		document.getElementById("HeaderChristmasDaybeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + findYear(n.getFullYear(), n.getMonth(), 11) + "-12-25&4=Christmas&5=Merry+Christmas&6=christmasTree";
		document.getElementById("HeaderTestbeta").href = "https://liambloom.github.io/Countdown/beta.html?0=" + n.getFullYear() + "-" + (n.getMonth() + 1) + "-" + n.getDate() + "&1=" + n.getHours() + ":" + n.getMinutes() + "&2=" + (n.getSeconds() + 15) + "&4=Results&5=Now";
	</script>
	`);
}