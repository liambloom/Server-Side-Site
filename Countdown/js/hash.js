//jshint esversion:6
const hash = () => {
	//console.log("hash ran");
	if (location.hash) {
		//console.log("hash exists");
		if (links[location.hash.replace(/^#/, "")]) {
			//console.log("hash redirect");
			//const q = 
			let q = "";
			if (typeof location.search.replace(/^\?/, "") === "string") {
				if (/\S/.test(location.search.replace(/^\?/, ""))) {
					q = location.search.replace(/^\?/, "") + "&";
				}
			}
			location.assign("?" + q + links[location.hash.replace(/^#/, "")]);
		}
	}
};