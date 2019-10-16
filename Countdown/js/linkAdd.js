//jshint esversion:6
function linkAdd(obj, lnk) {
	//var together = txt.link(document.getElementById(txt).href + lnk);
	//alert(document.getElementById(txt) + " + " + lnk)
	for(let i in obj){
		let hash = new URL(document.getElementById(i).href).hash;
		let hashRegex = new RegExp(hash + "$");
		document.getElementById(i).href = document.getElementById(i).href.replace(hashRegex, lnk + hash);//together;
	}
}