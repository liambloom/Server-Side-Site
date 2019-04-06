//jshint esversion:9
const express = require("express");
const url = require("url");
const fs = require("fs");
const mime = require("mime-types");

const app = express();
const port = process.env.PORT || 8080;

app.set("view engine", "ejs");

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const filetype = req => req.match(/(?<=\.)[^.\/]+$/);

const serve = (req, res, page, loop = 0, status = 200) => {
	fs.readFile(page, (err, data) => {
		//If non-ejs file not found
		if (err && filetype(page) !== null) {
			//if this is the first try, server 404
			if (loop <= 0) {
				//console.log(err);
				serve(req, res, "./404", loop + 1, 404);
			}
			//else, serve 500
			else {
				res.writeHead(500, { "Content-Type": "text/html" });
				res.write(`The page ${path(req).href} could not be found<br>${err}`);
				res.end();
			}
		}
		//else if non-ejs file found
		else if (filetype(page) !== null) {
			//try serving page
			try {
				res.writeHead(status, { "Content-Type": mime.contentType(filetype(page)[0]) });
				res.write(data);
				res.end();
			}
			//if error, serve 500
			catch (error) {
				res.writeHead(500, { "Content-Type": "text/html" });
				res.write(`The page ${path(req).href} could not be found<br>${error}`);
				res.end();
			}
		}
		else {
			res.render(page, { target: path(req).href }, (error, html) => {
				//if ejs file not found and this is first try, serve 404
				if (error && loop <= 0) {
					//console.log(error);
					serve(req, res, "./404", loop + 1, 404);
				}
				//else if ejs file found, serve it
				else if (html) {
					res.writeHead(status, { "Content-Type": "text/html" });
					res.write(html);
					res.end();
				}
				//if the 404 didn't work, serve 500
				else {
					res.writeHead(500, { "Content-Type": "text/html" });
					res.write(`The page ${path(req).href} could not be found`);
					res.end();
				}
			});
		}
	});
};

//ejs index server
app.get(/\/$/, (req, res) => {
	serve(req, res, `.${path(req).pathname}index`);
});

//regular ejs server
app.get(/\/[^\/.]+$/, (req, res) => {
	serve(req, res, `.${path(req).pathname}`);
});

//non-ejs server
app.get(/\/[^]+\.[^]+$/, (req, res) => {
	serve(req, res, `.${path(req).pathname}`);
});

app.post("/sugestions/:type", (req, res) => {
	fs.appendFile("./sugestions/" + req.params.type, req.read().toString(), (err) => {
		console.log(req.read().toString());
		if (err) res.status(404).end();
		else res.status(200).end();
	});
});

app.listen(port);