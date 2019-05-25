//jshint esversion:9
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
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
/*passport.use(new LocalStrategy((username, password, cb) => { // cb = callback
  pool.query("SELECT * FROM users WHERE username=$1", [username], (error, data) => {
    if (error) {
      return cb(error); //500
    }
    if (data.rows.length > 0) {
      const first = result.rows[0];
      bcrypt.compare(password, first.password, (err, res) => {
        if (res) cb(null, first); //200
        else cb(null, false); //403
      });
    }
    else cb(null, false); //401
  });
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, cb) => {
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, data) => {
    if (err) return cb(err);
    cb(null, results.rows[0]);
  });
});*/
pool.on("error", (err) => {
  //Handle error
});
const createTable = (req, res) => {
  //pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid DEFAULT uuid_generate_v4,
      username varchar(100) UNIQUE NOT NULL,
      password varchar(100) NOT NULL,
      email varchar(50) NOT NULL,
      color varchar(15),
      light varchar(5),
      type varchar(12) NOT NULL,
      since date NOT NULL
    );
  `);// I don't know if I actually need to make the id unique, since uuids have a very low chance of being the same (1/32^16 = 1/1,208,925,820,000,000,000,000,000 = 0.00000000000000000000008%)
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

  /*pool.query("SELECT password FROM users WHERE username = $1", [username], (err, data) => {
    if (err) res.status(500).send(err);
    else if (!data.rows[0]) res.status(401).end();
    else if (data.rows[0].password === password) res.status(200).send(data.rows[0].id);
    else res.status(403).end();
  });*/
  //res.status("204").end();
  //res.redirect(somewhere)
  pool.query("SELECT id, password FROM users WHERE username=$1", [username], (error, data) => {
    if (error) {
      return res.status(500).send(error);//cb(error); //500
    }
    if (data.rows.length > 0) {
      const user = data.rows[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) res.status(500).send(err);
        if (result) res.status(200).send(user.id); //cb(null, first); //200
        else res.status(403).end(); //cb(null, false); //403
      });
    }
    else res.status(401).end(); //cb(null, false); //401
  });
};
const createUser = (req, res) => {
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
        else res.status(201).send(id);//.end();
      });
    });
  })
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