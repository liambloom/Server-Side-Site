function destroy(id) {
	var elem = document.getElementById(id);
	elem.parentNode.removeChild(elem);
	//thanks to catalin.red for this code
}