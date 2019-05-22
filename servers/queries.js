//jshint esversion:9
//const passport = require("passport-local");
const { Pool } = require("pg");
const { dbConfig } = {dbConfig: {user, password, host, port, max, idleTimeoutMillis} = config.db};//fo production, use process.env instead of config.db
const pool = new Pool(dbConfig/*{
  user: config.db.user,
  password: config.db.password,
  host: config.db.host,
  port: config.db.port,
  max: config.db.max,
  idleTimeoutMillis: config.db.idleTimeoutMillis
}*/);
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
  pool.query(`CREATE TABLE users (
    id bigserial PRIMARY KEY,
    username varchar(225) UNIQUE,
    password varchar(100),
    type varchar(50)
  )`);
};
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, data) => {
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
    if (err) res.stauts(500).send(err);
    else {
      
    }
  });
};
const createUser = (req, res) => {
  const { username, password } = req.body;

  pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(`User added with ID: ${id}`);
  });
};
const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password } = req.body;

  pool.query("UPDATE users SET username = $1, password = $2 WHERE id = $3", [username, password, id], (err, data) => {
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
  query: pool.query,
  getUsers,
  getUserById,
  confirmUser,
  createUser,
  updateUser,
  deleteUser
};