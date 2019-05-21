//jshint esversion:9
const { Pool } = require("pg");
const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "api",
  password: "password",
  port: "5432"
});
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
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};