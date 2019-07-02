const { mail, initPool } = require("./mail");
const { bcrypt, uuid, pool, path, handle, fs } = initPool;//require("./initPool");

const createTable = () => {
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
  pool.query(`
      CREATE TABLE IF NOT EXISTS confirm (
        userid uuid NOT NULL,
        code uuid NOT NULL,
        email varchar(50) NOT NULL
      );
  `);
};
const login = (req, res, userid) => {
  //returnValue = 
  return new Promise((resolve, reject) => {
    const id = uuid();
    pool.query("INSERT INTO sessions (sessionid, userid) VALUES ($1, $2)", [id, userid])
      .then(() => {
        req.session.user = id;
      })
      .then(resolve)
      .catch(reject);
  });
};
const newUser = (req, res, id, username, password, email, color, light) => {
  pool.query("INSERT INTO users (id, username, password, email, color, light, type, since) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id, username, password, email, color, light, "USER", "today"])
    .then(data => {
      login(req, res, id)
        .then(() => { res.status(201).end(); })
        .catch(handle);
    })
    .catch(handle);
};
const getAll = (req, res) => {
  pool.query("SELECT * FROM users")
    .then(data => {
      for (let row of data.rows) {
        delete row.id;
        delete row.password;
      }
      return data;
    })
    .then(data => {
      if (data.rowCount) {
        res.render("./admin/users", { data: JSON.stringify(data.rows), here: req.originalUrl }, (err, html) => {
          if (err) handle(err);
          else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      }
      else throw "No Sugestions";
    })
    .catch(handle);
};
const get = (id, callback) => {
  //const id = parseInt(req.params.id);

  pool.query("SELECT * FROM users WHERE id = $1", [id])
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

  pool.query("SELECT id, password FROM users WHERE username=$1", [username])
    .then(data => {
      if (data.rows.length > 0) {
        const user = data.rows[0];
        bcrypt.compare(password, user.password)
          .then(async(result) => {
            if (result) {
              login(req, res, user.id)
                .then(() => { res.status(204).end(); console.log("logged in"); })
                .catch(handle);
            }
            else res.status(403).end();
          })
          .catch(handle);
      }
      else res.status(401).end();
    })
    .catch(handle);
};
const create = (req, res) => {
  const { username, password, email, color, light } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      const id = uuid();
      pool.query("SELECT id FROM users WHERE username = $1", [username])
        .then(user => {
          if (user.rows[0]) res.status(409).end();
          else {
            if (!email) newUser(req, res, id, username, hash, email, color, light);
            else {
              const code = uuid();
              pool.query("INSERT INTO confirm (userid, code, email) VALUES ($1, $2, $3)", [id, code, email])
                .then(() => {
                  fs.readFile("./json/themes.json", (err, data) => {
                    if (err) handle(err);
                    else {
                      newUser(req, res, id, username, hash, null, color, light);
                      const theme = JSON.parse(data)[color];
                      const newTheme = {
                        light: theme.gradientLight,
                        dark: theme.gradientDark,
                        headTxt: theme.headTextColor,
                        color: color
                      };
                      if (light === "dark") {
                        newTheme.bg = theme.offBlack;
                        newTheme.txt = theme.headTextColor;
                      }
                      else {
                        newTheme.bg = theme.offWhite;
                        newTheme.txt = theme.offBlack;
                      }
                      mail.confirm(res, email, username, newTheme, code, path(req));
                    }
                  });
                })
                .catch(handle); // Is this valid syntax, or is the callback required?
            }
          }
        })
        .catch(handle);
    })
    .catch(handle);
};
const update = (req, res) => {
  const id = req.user.id;
  const { category, value } = req.body;
  if (/id|username|password|since/.test(category)) res.status(405).send("These categories cannot be updated").end();
  if (category === "type" && req.user.type !== "ADMIN") res.status(403).send("This is an admin only action").end();

  pool.query(`UPDATE users SET ${category} = $1 WHERE id = $2`, [value, id])
    .then(data => {
      res.status(204).end();
    })
    .catch(handle);
}; 
update.fromEmailConfirm = (req, res) => {
  const id = req.params.addId;
  pool.query("UPDATE users SET email = (SELECT email FROM confirm WHERE code = $1) WHERE id = (SELECT userid FROM confirm WHERE code = $1)", [id])
    .then(data => {
      if (data.rowCount >= 1) {
        pool.query("DELETE FROM confirm WHERE code = $1 RETURNING userid", [id])
          .then(data => {
            if (data.rows[0] ? !data.rows[0].userid : true) {
              throw "No user id found";
            }
            else {
              login(req, res, data.rows[0].userid)
                .then(() => { res.redirect(303, "/"); })
                .catch(handle);
            }
          })
          .catch(handle);
      }
      else { res.status(404).end(); console.log("no such user"); }
    })
    .catch(handle);
};
sendRecoveryCode = (req, res) => {

};
getRecoveryCode = (req, res) => {

};
update.fromPasswordRecovery = (req, res) => {

};
hasEmail = (req, res) => {
  //console.log("checked email");
  const id = req.user.id;
  pool.query("SELECT email FROM users WHERE id = $1", [id])
    .then(data => {
      if (data.rows[0] ? data.rows[0].email : false) res.status(204).end();
      else res.status(404).end();
    })
    .catch(handle);
};
const removeEmail = (req, res) => {
  pool.query("UPDATE users SET email = NULL WHERE id = $1", [req.user.id])
    .then(res.status(204).end())
    .catch(handle);
};
const remove = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id])
    .then(data => {
      res.status(204).end();
    })
    .catch(handle);
};
const logout = (req, res) => {
  req.session.reset();
  res.redirect(path(req).query.u);
};
const add = (req, res) => {
  const { content, type } = req.body;
  //const d = new Date();

  pool.query("INSERT INTO sugestions (content, type, by, created) VALUES ($1, $2, $3, $4)", [content, type, (req.user) ? req.user.username : null, "now"])
    .then(data => {
      res.status(201).end();
    })
    .catch(handle);
};
const getSugestions = (req, res) => {
  pool.query("SELECT * FROM sugestions")
    .then(data => {
      if (data.rowCount) {
        res.render("./admin/sugestions", { data: JSON.stringify(data.rows), here: req.originalUrl }, (err, html) => {
          if (err) handle(err);
          else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(html);
            res.end();
          }
        });
      }
      else throw "No Sugestions";
    })
    .catch(handle);
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
    removeEmail,
    //remove,
    logout,
    hasEmail,
    recover: {
      get: getRecoveryCode,
      send: sendRecoveryCode
    }
  },
  sugestions: {
    add,
    get: getSugestions
  },
  session: {
    get: getSession
  }
};