//jshint esversion:9
const { bcrypt, uuid, pool, path, shortHash, mail, fs } = require("./initPool");

const createTable = (req, res) => {
  //pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid NOT NULL,
      username varchar(100) UNIQUE NOT NULL,
      password varchar(100) NOT NULL,
      email varchar(50),
      color varchar(15),
      light varchar(5),
      type varchar(12) NOT NULL,
      since date NOT NULL
    );
  `);// I don't know if I actually need to make the id unique, since uuids have a very low chance of being the same (1/32^16 = 1/1,208,925,820,000,000,000,000,000 = 0.00000000000000000000008%)
  pool.query(`
    CREATE TABLE IF NOT EXISTS sugestions (
      content varchar(500) NOT NULL,
      type varchar(10) NOT NULL,
      by varchar(100),
      created timestamptz NOT NULL
    );
  `);
  pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      sessionid uuid NOT NULL,
      userid uuid NOT NULL
    );
  `);
};
const login = (req, res, userid) => {
  return new Promise((resolve, reject) => {
    //console.log("logged in");
    const id = uuid();
    pool.query("INSERT INTO sessions (sessionid, userid) VALUES ($1, $2)", [id, userid/*, new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString().replace("T", " ").replace(/[a-z]*$/i, "")*/], (err, data) => {
      console.log(err);
      if (err) reject(err);
      else {
        req.session.user = id;
        resolve();
      }
    });
  });
};
const newUser = (req, res, username, password, email, color, light) => {
  pool.query("INSERT INTO users (id, username, password, email, color, light, type, since) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id, username, password, email, color, light, "USER", "today"/*d.toISOString().split("T")[0]*/], (err, data) => {
    if (err) res.status(500).send(err);
    else {
      //req.session.user = id;
      login(req, res, id)
        .then(() => { res.status(201).end(); })
        .catch(err => { res.status(500).end(err); });
      //res.status(201).end();
    }
  });
};
const getAll = (req, res) => {
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
  .then(callback)
  .catch(err => callback(undefined));
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
          //req.session.user = user.id;
          login(req, res, user.id)
            .then(() => { res.status(204).end(); })
            .catch(err => { res.status(500).end(err); });
          
        }
        else res.status(403).end();
      });
    }
    else res.status(401).end();
  });
};
const create = (req, res) => {
  const { username, password, email, color, light } = req.body;
  bcrypt.hash(password, 10, (e, hash) => {
    if (e) res.status(500).send(e);
    const id = uuid();
    pool.query("SELECT id FROM users WHERE username = $1", [username], (error, user) => {
      if (error) res.status(500).send(error);
      else if (user.rows[0]) res.status(409).end();
      else {
        if (!email) newUser(req, res, username, hash, email, color, light);
        else {
          const code = shortHash(uuid());
          fs.readFile("./json/themes.json", (err, data) => {
            if (err) res.status(500).end(err);
            else {
              res.status(202).json({ code });
              const theme = JSON.parse(data)[color];
              mail.confirm(email, username, {

              }, code);
            }
          });
        }
      }
    });
  });
};
const update = (req, res) => {
  const id = req.user.id;
  const { category, value } = req.body;
  if (/id|username|password|since/.test(category)) res.status(403).send("These categories cannot be updated");
  if (category === "type" && req.user.type !== "ADMIN") res.status(403).send("This is an admin only action");

  pool.query(`UPDATE users SET ${category} = $1 WHERE id = $2`, [value, id], (err, data) => {
    if (err) {
      res.status(500).send(err);
      console.error(err);
    }
    else res.status(204).end();
  });
}; 
/*const update = (req, res) => {
  const id = req.user.id;
  try {
    for (let i of req.body) {
      const { category, value } = i;
      if (/id|username|password|since/.test(category) || (category === "type" && req.user.type !== "ADMIN")) throw "Your request was marked as suspicious."; // This request is suspicious, do not continue

      pool.query(`UPDATE users SET ${category} = $1 WHERE id = $4`, [value, id], (err, data) => {
        if (err) throw err;
      });
    }
    res.status(204).end();
  }
  catch (err) {
    res.status(500).send(err);
  }
};*/
const remove = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(204).end();
  });
};
const logout = (req, res) => {
  req.session.reset();
  res.redirect(path(req).query.u);
};
const add = (req, res) => {
  const { content, type } = req.body;
  //const d = new Date();

  pool.query("INSERT INTO sugestions (content, type, by, when) VALUES ($1, $2, $3, $4)", [content, type, (req.user) ? req.user.username : null, "now"/*d.toISOString().replace(/[a-z]$/i, "")*/], (err, data) => {
    if (err) res.status(500).send(err);
    else res.status(201).end();
  });
};
const getSession = (sessionId, callback) => {
  pool.query("SELECT userid FROM sessions WHERE sessionid = $1", [sessionId], (err, data) => {
    //console.log("this ran");
    if (err) {
      callback(false);
      console.error(err);
    }
    else if (data.rows) {
      //if (new Date(data.expires).getTime() < new Date().getTime()) callback(false);
      //console.log(data);
      /*else */callback(data.rows[0].userid);
    }
    else callback(false);
  });
};

module.exports = {
  createTable,
  user: {
    getAll,
    get,
    confirm,
    create,
    update,
    //remove,
    logout
  },
  sugestions: {
    add
  },
  session: {
    get: getSession
  }
};