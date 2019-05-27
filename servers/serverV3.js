//jshint esversion:9
const express = require("express");
const nodemailer = require("nodemailer");
const serve = require("./servePage");
const DB = require("./queries");
const session = require("client-sessions");
const os = require("os");

const app = express();
const port = process.env.PORT || 8080;
const testing = os.hostname().includes("DESKTOP");
const requireLogin = (req, res, next) => {//To use this: app.get("/somewhere", requireLogin, (req, res) => server("/somewhere")) - this will only be served if user is logged in
  if (!req.user) res.redirect("/login?u=" + req.originalUrl);
  else next();
};


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//DB.secret.get("cookieSecret", secret => {// Cookie secret is a 32 digit base 62 pseudo-random number I generated when setting up session management
app.use(session({
  cookieName: "session",
  secret: process.env.SECRET || "L6WpMp3EJLroE9YtzXLoYr5pU2enJSSj",//secret,
  duration: 30 * 60 * 60 * 1000,
  activeDuration: 10 * 60 * 1000,
  httpOnly: true,
  secure: !testing,// I should probably get an ssl certificate
  ephemeral: true// This means delete the cookie when the browser is closed
}));
//});
app.use((req, res, next) => {
  if ((req.session) ? req.session.user : false) {
    DB.user.get(req.session.user, data => {
      if (data) {
        req.user = data;
        req.session.user = data.id;
        res.locals.user = data;
      }
      next();
    });
  }
  else {
    next();
  }
});

//const DB = require("./queries");

/*const bcrypt = require("bcrypt"); // This works differently depending on the os it is compiled on, so must have a seperate download for local and server
//const os = require("os");
const uuid = require("uuid/v4");
//const session = require("client-sessions");
const { Pool } = require("pg");
//const testing = os.hostname().includes("DESKTOP");
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
  }*//*)
    .then(res => res.rows[0])
    .then(res => {
      delete res.password;
      return res;
    })
    .then(callback);
};
const confirm = (req, res) => {
  const { username, password } = req.body;

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
};*/

app.post("/api/sugestion", (req, res) => {
  res.render("./email", {
    offWhite: req.body.theme.offWhite,
    offBlack: req.body.theme.offBlack,
    txt: req.body.theme.headTextColor,
    light: req.body.theme.gradientLight,
    data: `
      ${new Date(req.body.timestamp).toString().replace(/\s\([^()]+\)/, "")}
      <br>
      <br>
      ${req.body.data.replace(/\n/g, "<br>")}
    `
  }, (err, html) => {
    if (err) {
      console.log(err);
    }
    else {
      page = html;
    }
  });
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "liamserveremail@gmail.com",
      pass: "imaServer"
    }
  })
  .sendMail({
    from: "liamserveremail@gmail.com",
    to: "liamrbloom@gmail.com",
    subject: "Here's a sugestion",
    html: page
  }, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).end();
    }
    else {
      res.status(200);
      res.write(info.response);
      res.end();
    }
  });
});

app.get("/api/users/:id", DB.user.get);
app.post("/api/users/create", DB.user.create);
app.post("/api/users/confirm", DB.user.confirm);
//app.put("api/users/:id", DB.user.update);
//app.delete("/api/users/:id", DB.user.delete);
app.get("/logout", DB.user.logout);

app.get(/^(?!\/(?:non-existentPage))/, serve);
app.get(/\/(?:non-exsitentPage)/, requireLogin, serve);

app.listen(port, () => { 
  DB.createTable();
  console.log(`[Server] [${new Date().toString()}]: Server running on port ${port}.`);
  //console.log(DB.secret.getSecret("cookieSecret"));
});