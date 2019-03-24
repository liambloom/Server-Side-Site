function addNav() {
	document.write(`
<header id="topMenu">
	<script src="https://liambloom.github.io/Countdown/js/findDay.js"></script>
	<script src="https://liambloom.github.io/Countdown/js/findYear.js"></script>
	<script src="https://liambloom.github.io/Countdown/js/findLast.js"></script>
	<script src="https://liambloom.github.io/Countdown/js/links.js"></script>
	<script src="https://liambloom.github.io/Countdown/js/destroy.js"></script>
	<style>
		header {
			margin-bottom: 10px;
			padding: 0px;
			position: fixed;
			left: 0px;
			right: 0px;
			top: 0px;
		}

		header ul {
			list-style-type: none;
			margin: 0;
			padding: 0;
			overflow: hidden;
			background-color: rgba(51, 51, 51, 0.5);

		}

		/*header ul.main{
			top: 0px;
		}*/

		header li.v {
			float: left;
		}

		header li a {
			display: block;
			color: white;
			padding: 14px 16px;
			text-decoration: none;
		}

		header li a.main {
			text-align: center;
		}

		header li a:hover {
			background-color: rgba(17, 17, 17, 0.5);
		}

		header ul.dropdown {
			display: none;
		}

		header li a:hover + ul.dropdown {
			display: initial;
		}

		header ul.dropdown:hover {
			display: initial;
		}

		header span.super{
			vertical-align: super;
			font-style: italic;
			color: #e79622;
		}
	</style>
	<ul class="main">
		<li class="v">
			<a href="https://liambloom.github.io/index.html">Home<span class="super"></span></a>
			<ul class="dropdown">
				<li><a href="https://liambloom.github.io/MagicEight.html">Magic Eight Ball</a></li>
				<li><a href="https://liambloom.github.io/RandomColor.html">Random Color</a></li>
				<li><a href="https://liambloom.github.io/GradientColor.html">Gradient Color</a></li>
			</ul>
		</li>
		<li class="v">
			<a href="https://liambloom.github.io/Countdown/index.html">Countdown<span class="super"></span></a>
			<ul class="dropdown">
				<li><a onclick="window.location.assign(linksMaker(0, 'https://liambloom.github.io/Countdown/index.html'))">New Years Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(1, 'https://liambloom.github.io/Countdown/index.html'))">Martin Luther King Jr. Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(2, 'https://liambloom.github.io/Countdown/index.html'))">George Washington's Birthday</a></li>
				<li><a onclick="window.location.assign(linksMaker(3, 'https://liambloom.github.io/Countdown/index.html'))">Memorial Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(4, 'https://liambloom.github.io/Countdown/index.html'))">Independence Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(5, 'https://liambloom.github.io/Countdown/index.html'))">Labor Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(6, 'https://liambloom.github.io/Countdown/index.html'))">Columbus Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(7, 'https://liambloom.github.io/Countdown/index.html'))">Veterans Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(8, 'https://liambloom.github.io/Countdown/index.html'))">Thanksgiving Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(9, 'https://liambloom.github.io/Countdown/index.html'))">Christmas Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(10, 'https://liambloom.github.io/Countdown/index.html'))">Test</a></li>
			</ul>
		</li>
		<li class="v">
			<a href="https://liambloom.github.io/Countdown/beta.html">Countdown<span class="super">beta</span></a>
			<ul class="dropdown">
				<li><a onclick="window.location.assign(linksMaker(0, 'https://liambloom.github.io/Countdown/beta.html'))">New Years Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(1, 'https://liambloom.github.io/Countdown/beta.html'))">Martin Luther King Jr. Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(2, 'https://liambloom.github.io/Countdown/beta.html'))">George Washington's Birthday</a></li>
				<li><a onclick="window.location.assign(linksMaker(3, 'https://liambloom.github.io/Countdown/beta.html'))">Memorial Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(4, 'https://liambloom.github.io/Countdown/beta.html'))">Independence Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(5, 'https://liambloom.github.io/Countdown/beta.html'))">Labor Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(6, 'https://liambloom.github.io/Countdown/beta.html'))">Columbus Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(7, 'https://liambloom.github.io/Countdown/beta.html'))">Veterans Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(8, 'https://liambloom.github.io/Countdown/beta.html'))">Thanksgiving Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(9, 'https://liambloom.github.io/Countdown/beta.html'))">Christmas Day</a></li>
				<li><a onclick="window.location.assign(linksMaker(10, 'https://liambloom.github.io/Countdown/beta.html'))">Test</a></li>
			</ul>
		</li>
		<li class="v">
			<a href="https://liambloom.github.io/school/index.html">School<span class="super"></span></a>
			<ul class="dropdown">
				<li><a href="https://liambloom.github.io/school/SocialStudiesProject.html">Ancient Egyptian Social Class Project</a></li>
				<li><a href="https://liambloom.github.io/school/ScienceVocab.html">Science Vocab</a></li>
				<li><a href="https://liambloom.github.io/school/ELAgreekMythologyScript.html">Greek Mythology Play Script</a></li>
				<li><a href="https://liambloom.github.io/school/ScratchPrometheus.html">Promethius Cartoon<span class="super">beta</span></a></li> 
			</ul>
		</li>
		<li class="v" style="float: right">
			<a onclick="destroy('topMenu')">Hide Menu<span class="super"></span></a>
		</li>
	</ul>
</header>
	`)
}