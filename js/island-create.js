//jshint esversion:6
const create = () => {
	let locations = [[1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [2, 5]];
	for (let x = 1; x <= 6; x++) {
		for (let y = 1; y <= 6; y++) {
			if (!(((x === 1 || x === 6) && (y <= 2 || y >= 5)) || ((y === 1 || y === 6) && (x <= 2 || x >= 5)))) {
				locations.push([x, y]);
			}
		}
	}
	for (let i = 0; 0 < locations.length; i++) {
		let img = document.createElement("img");
		img.setAttribute("src", "../img/test.png");
		img.setAttribute("style", `grid-column: ${locations(Math.floor(Math.random() * locations.length))};`);
		document.getElementById("Board").appendChild("img");
	}
};