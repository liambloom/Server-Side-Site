//jshint esversion:6
const os = require("os");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const url = require("url");
const fs = require("fs");
const mail = require("./mail");
const { Pool } = require("pg");

const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const testing = os.hostname().includes("DESKTOP");
const handle = (err) => {
  console.error(err);
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.send(JSON.stringify({ error: err }));
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
  fs
};