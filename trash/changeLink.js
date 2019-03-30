function changeLink(txt, lnk) {
		var together = txt.link("?" + lnk);
		document.getElementById(txt).innerHTML = together;
}