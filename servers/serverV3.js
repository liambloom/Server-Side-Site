//jshint esversion:8
//const http = require("http");//Do I need this?
const express = require("express");
const url = require("url");
const fs = require("fs");
const mime = require("mime-types");

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");

const path = req => url.parse(req.url, true).pathname;
const filetype = req => req.match(/(?<=\.)[^.\/]+$/);//Does this work
const serve = (req, res, page, loop = 0, status = 200) => {
	fs.readFile(page, (err, data) => {
		if (err && filetype(page) !== null) {
			if (loop <= 0) {
				serve(req, res, "./404", loop + 1, 404);
			}
			else {
				//console.log(filetype(page));
				res.writeHead(500, { "Content-Type": "text/html" });
				res.write(`The page ${path(req).href} could not be found<br>${err}`);
				res.end();
			}
		}
		else {
			if (filetype(page) !== null) {
				try {
					res.writeHead(status, { "Content-Type": mime.contentType(filetype(page)[0]) });
					res.write(data);
					res.end();
				}
				catch (error) {
					res.writeHead(500, { "Content-Type": "text/html" });
					res.write(`The page ${path(req).href} could not be found<br>${error}`);
					res.end();
				}
			}
			else {
				//try {
					res.render(page,/* undefined,*/ (error, html) => {
						if (error && loop <= 0) {
							serve(req, res, "./404", loop + 1, 404);
						}
						else if (html) {
							res.writeHead(status, { "Content-Type": "text/html" });
							res.write(html);
							res.end();
						}
						else {
							res.writeHead(500, { "Content-Type": "text/html" });
							res.write(`The page ${path(req).href} could not be found`);
							res.end()
						}
					});
					//Do I need this?
				/*}
				catch (error) {
					serve(req, res, "./404/index", loop + 1, 404);
				}*/
			}
			/*try {	
				//Does || do what I think it does?
				if (filetype(page) !== null) {
					res.writeHead(status, { "Content-Type": mime.contentType(filetype(page)[0]) });
					res.write(data);
				}
				else {
					res.writeHead(status, { "Content-Type": "test/html" });
					res.render(page);
				}
				res.end();
			}
			catch (error) {
				if (filetype(page) !== null) {
					res.writeHead(500, { "Content-Type": "text/html" });
					res.write(`The page ${path(req).href} could not be found<br>${error}`);
					res.end();
				}
				else {
					serve(req, res, "./404/index", loop + 1, 404);
				}
			}*/
		}
	});
};
/*const err404 = (req, res, err) => {
	serve(req, res, "./404/index.html", (req, res) => {
		err500(req, res);
	}, 404);
};
const err500 = (req, res, error) => {
	
};*/

app.get(/\/$/, (req, res) => {
	//serve(req, res, `.${path(req)}index.html`);
	//console.log("index.ejs server ran");
	/*res.writeHead(status || 200, { "Content-Type": mime.contentType(filetype(page)) });
	res.render(`.${path(req)}index`);
	res.end();*/
	serve(req, res, `.${path(req)}index`);
});

app.get(/\/[^\/.]+$/, (req, res) => {
	//serve(req, res, `.${path(req)}`);
	//console.log(res.render("./views/header"))
	//console.log(".ejs server ran");
	/*try {
		res.writeHead(status || 200, { "Content-Type": mime.contentType(filetype(page)) });
		res.render(`.${path(req)}`);
		res.end();
	}
	catch (err) {

	}*/
	serve(req, res, `.${path(req)}`);
	//res.render("test");
});

app.get(/\/[^]+\.[^]+$/, (req, res) => {
	//console.log("Regular server ran");
	serve(req, res, `.${path(req)}`);
});

/*app.route("/css/theme-sugestions.json")
	.get((req, res) => {
		serve(req, res, "../css/theme-sugestions.json");
	})
	.post((req, res) => {
		fs.readFile("../css/theme-sugestions.json", (err, data) => {
			if (err) throw err;
			else {
				let sugestions = JSON.parse(data);
				sugestions.sugestions.push(JSON.parse(url.parse(req.url, true).query));
				fs.writeFile("../css/theme-sugestions.json", JSON.stringify(sugestions), (err) => {
					if (err) {
						res.status(500).send(sugestions);
						throw err;
					}
					else {
						res.status(201).send(sugestions);
					}
				});
				//console.log(url.parse(req.url, true).query);
			}
		});
	})//Do I need a ;
	

app.post("/css/");*/

app.listen(port, () => { console.log(`Server running on port ${port}...`); });