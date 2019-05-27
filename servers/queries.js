//jshint esversion:9
/*const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;*/
const bcrypt = require("bcrypt"); // This works differently depending on the os it is compiled on, so must have a seperate download for local and server
const os = require("os");
const uuid = require("uuid/v4");
//const session = require("client-sessions");
const { Pool } = require("pg");
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
const path = req => url.parse(`${req.protocol}://${req.get("host")}${req.originalUrl}`, true);
const createTable = (req, res) => {
  //pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid,
      username varchar(100) UNIQUE NOT NULL,
      password varchar(100) NOT NULL,
      email varchar(50) NOT NULL,
      color varchar(15),
      light varchar(5),
      type varchar(12) NOT NULL,
      since date NOT NULL
    );
  `);// I don't know if I actually need to make the id unique, since uuids have a very low chance of being the same (1/32^16 = 1/1,208,925,820,000,000,000,000,000 = 0.00000000000000000000008%)
  pool.query(`
     CREATE TABLE IF NOT EXISTS secret (
       name varchar(20) UNIQUE,
       data varchar(100)
     );
  `);
};
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users", (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(data.rows);
  });
};
const get = (id, callback) => {
  //const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id]/*, (err, data) => { // $1 is a variable passed in as [id]
    if (err) res.status(500).send(err);
    else res.status(200).json(data.rows);
  }*/)
  .then(res => res.rows[0])
  .then(res => {
    delete res.password;
    return res;
  })
  .then(callback);
};
const confirm = (req, res) => {
  const {username, password} = req.body;

  pool.query("SELECT id, password FROM users WHERE username=$1", [username], (error, data) => {
    if (error) {
      return res.status(500).send(error);
    }
    if (data.rows.length > 0) {
      const user = data.rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) res.status(500).send(err);
        if (result) {
          req.session.user = user.id;
          res.status(204).end();
        }
        else res.status(403).end();
      });
    }
    else res.status(401).end()
  });
};
const create = (req, res) => {
  const { username, password, email, color, light } = req.body;
  bcrypt.hash(password, 10, (e, hash) => {
    if (e) res.status(500).send(e);
    const now = new Date();
    const id = uuid();
    pool.query("SELECT id FROM users WHERE username = $1", [username], (error, user) => {
      if (error) res.status(500).send(error);
      else if (user.rows[0]) res.status(409).end();
      else pool.query("INSERT INTO users (id, username, password, email, color, light, type, since) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id, username, hash, email, color, light, "USER", `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`], (err, data) => {
        if (err) res.status(500).send(err);
        else {
          req.session.user = id;
          res.status(201).end();
        }
      });
    });
  });
};
const update = (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password, type } = req.body;

  pool.query("UPDATE users SET username = $1, password = $2, type = $3 WHERE id = $4", [username, password, type, id], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(204).end();
  });
};
const remove = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(204).end();
  });
};
const logout = (req, res) => {
  req.session.reset();
  res.redirect(path(req).query);
};
const getSecret = (name, callback) => {
  pool.query("SELECT data FROM secret WHERE name = $1", [name])
  .then(res => res.rows[0].data)
  .then(callback);
};

module.exports = {
  createTable,
  user: {
    get,
    confirm,
    create,
    //update,
    //remove,
    logout
  },
  secret: {
    get: getSecret
  }
};