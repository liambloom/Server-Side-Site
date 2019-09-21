"use strict";
const os = require("os");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const url = require("url");
const fs = require("fs");
const mail = require("./mail");
const randomKey = require("./randomKey");
const EventEmitter = require("events");
const { Pool } = require("pg");
require("./NodeJSplus")();

global.event = new EventEmitter();
global.path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
global.testing = os.hostname().includes("DESKTOP");
global.handle = (err, res) => {
  console.error(err);
  try {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
  }
  catch (err) {console.error(err);}
  res.write(JSON.stringify({ error: err }));
  res.end();
};
const testConfig = {
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: "5432",
  ssl: false
};
const herokuConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};
const pool = new Pool((testing) ? testConfig : herokuConfig);
pool.on("error", (err) => {
  //Handle error
});

module.exports = {
  pool,
  bcrypt,
  uuid,
  path,
  mail,
  handle,
  fs,
  randomKey
};