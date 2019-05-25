//jshint esversion:9
const passport = require("passport-local");
const os = require("os");
const uuid = require("uuid/v4");
const { Pool } = require("pg");
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
//console.log(os.hostname());
const pool = new Pool((os.hostname().includes("DESKTOP")) ? testConfig : herokuConfig);
//pool.connect();
/*passport.use(new LocalStrategy((username, password, cb) => {
  pool.query("SELECT * FROM users WHERE username=$1", [username], (err, data) => {
    if (err) {
      return cb(err);
    }
    if (data.rows.length > 0) {
      const first = result.rows[0];
      bcrypt.compare
    }
  });
}));
pool.on("error", (err) => {
  //Handle error
});*/
const createTable = (req, res) => {
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id varchar(36) UNIQUE NOT NULL,
      username varchar(225) UNIQUE NOT NULL,
      password varchar(100) NOT NULL,
      type varchar(50) NOT NULL,
      since date NOT NULL
    )
  `);
};
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users", (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).json(data.rows);
  });
};
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, data) => { // $1 is a variable passed in as [id]
    if (err) res.status(500).send(err);
    else res.status(200).json(data.rows);
  });
};
const confirmUser = (req, res) => {
  const {username, password} = req.body;

  pool.query("SELECT password FROM users WHERE username = $1", [username], (err, data) => {
    if (err) res.status(500).send(err);
    else if (!data.rows[0]) res.status(401).end();
    else if (data.rows[0].password === password) res.status(200).send(data.rows[0].id);
    else res.status(403).end();
  });
};
const createUser = (req, res) => {
  const { username, password } = req.body;
  const now = new Date();
  const id = uuid();

  pool.query("INSERT INTO users (id, username, password, type, since) VALUES ($1, $2, $3, $4, $5)", [id, username, password, "USER", `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(id);
  });
};
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password, type } = req.body;

  pool.query("UPDATE users SET username = $1, password = $2, type = $3 WHERE id = $4", [username, password, type, id], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(204).end();
  });
};
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(204).end();
  });
};
module.exports = {
  //query: pool.query,
  createTable,
  getUsers,
  getUserById,
  confirmUser,
  createUser,
  //updateUser,
  deleteUser
};