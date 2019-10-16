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
const filetype = req => req.match(/(?<=\.)[^.]+$/)[0];//Does this work
const serve = (req, res, page, onerr, status) => {
	fs.readFile(page, (err, data) => {
		if (err) {
			if (typeof onerr === "function") {
				onerr(req, res, err);
			}
			else {
				err404(req, res, err);
			}
		}
		else {
			try {
				//console.log(data);
				res.writeHead(status || 200, {"Content-Type" : mime.contentType(filetype(page))});//Does || do what I think it does?
				res.write(data);
				res.end();
			}
			catch (error) {
				err500(req, res, error);
			}
		}
	});
};
const err404 = (req, res, err) => {
	serve(req, res, "../404/index.html", (req, res) => {
		err500(req, res);
	}, 404);
};
const err500 = (req, res, error) => {
	res.writeHead(500, { "Content-Type": "text/html" });
	res.write(`The page ${req.url} could not be found<br>${error}`);
	res.end();
};

app.get(/\/$/, (req, res) => {
	serve(req, res, `.${path(req)}index.html`);
});

app.get(/[^]/, (req, res) => {
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

app.listen(port, () => {console.log(`Server running on port ${port}...`);});