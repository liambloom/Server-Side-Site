//jshint esversion:6
const os = require("os");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");
const url = require("url");
const { Pool } = require("pg");
const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const testing = os.hostname().includes("DESKTOP");
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
  path
};