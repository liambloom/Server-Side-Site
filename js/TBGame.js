var player = {
	hp: 20,
	cordinates: {
		x: 0,
		y: 0,
		z: 0,
		get full() {
			return "_" + this.x + "_" + this.y + "_" + this.z //var fullcords = [this.x, this.y, this.z].join("_")
		}
	},
	inventory: {}
}
var locations = {
	_0_0_0: ""
}