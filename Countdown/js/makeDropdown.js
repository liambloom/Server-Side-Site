function makeDropdown(menu, start, end, pl) {
	for (var i=start; i<=end; i++){
		var o = document.createElement("option");
		if (i.toString().length < pl){
			i = "0" + i;
		}
		o.text = i;
		o.value = i;
		document.getElementById(menu).add(o);
		i = Number(i);
	}
}