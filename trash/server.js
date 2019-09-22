//jshint esversion:8
const http = require("http");
const url = require("url");
const fs = require("fs");
//const chalk = require("chalk");

const port = process.env.PORT || 8090;

http.createServer("/", (req, res) => {
	//let filetype = url.parse(req.url, true).pathname.match(/(?<=\.)\w+$/)[0];
	fs.readFile(".." + url.parse(req.url, true).pathname, (err, data) => {
		if (err) {
			//if (/^(docx?|html?|odt|pdf|xlsx?|ods|pptx?|txt)$/i.test(filetype)) {
				/*fs.writeFile("./nodeFiles/reqDocument.json", req[1], errAdd => {
					if (errAdd) console.error("Could not put req in file because " + errAdd);
					else console.log(req);
				});*/
				fs.readFile("../404/index.html", (err404, data404) => {
					try {
						res.writeHead(404, { "Content-Type": "text/html"});
						res.write(data404);
						console.log("Real 404 ran for " + req.url);
						res.end();
					}
					catch (e) {
						res.writeHead(500, { "Content-Type": "text/html"});
						//res.write("Error: 404");
						console.log("404 was not found for " + req.url);
						res.end("Error: 404");
					}
				});
			/*}
			else {
				res.writeHead(404, "text/txt");
				res.write("This page does not exist");
				//console.log("basic 404 ran for " + req.url);
				res.end();
			}*/
		}
		else {
			try {
				/*if (/html?/i.test(url.parse(req.url, true).pathname.split(/\.(?=\w+$)/).pop())) {
					res.writeHead(200, { "Content-Type": "text/html"});
				}
				else (/css/i.test(url.parse(req.url, true).pathname.split(/\.(?=\w+$)/).pop())) {

				}*/
				res.write(data);
				console.log("served page " + req.url);
				res.end();
			}
			catch (e) {
				res.writeHead(500, {"Content-Type": "text/html"});
				console.log(`page ${req.url} not served because ${e}`);
				res.write("the page was not served");
				res.end(e.toString());
			}
		}
	});
}).listen(port);

console.log(`Server running on port ${port}...`);