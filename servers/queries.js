const { mail, initPool } = require("./mail");
const { bcrypt, uuid, pool, path, handle, fs, randomKey } = initPool;//require("./initPool");

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
  pool.query(`
    CREATE TABLE IF NOT EXISTS recovery (
      userid uuid NOT NULL,
      code varchar(7) NOT NULL
    )
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
    .then(() => {
      login(req, res, id)
        .then(() => { res.status(201).end(); });
    })
    .catch(err => { handle(err, res); });
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
    .catch(err => { handle(err, res); });
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
    .catch(() => callback(undefined));
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
                .then(() => { res.status(204).end(); })
                .catch(err => { handle(err, res); });
            }
            else res.status(403).end();
          })
          .catch(err => { handle(err, res); });
      }
      else res.status(401).end();
    })
    .catch(err => { handle(err, res); });
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
                .catch(err => { handle(err, res); }); // Is this valid syntax, or is the callback required?
            }
          }
        })
        .catch(err => { handle(err, res); });
    })
    .catch(err => { handle(err, res); });
};
const update = (req, res) => {
  const id = req.user.id;
  const { category, value } = req.body;
  if (/id|username|password|since/.test(category)) res.status(405).send("These categories cannot be updated").end();
  if (category === "type" && req.user.type !== "ADMIN") res.status(403).send("This is an admin only action").end();

  pool.query(`UPDATE users SET ${category} = $1 WHERE id = $2`, [value, id])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => { handle(err, res); });
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
              let id = data.rows[0].userid;
              event.emit("email-confirmed", id);
              login(req, res, id)
                .then(() => { res.redirect(303, "/"); })
                .catch(err => { handle(err, res); });
            }
          })
          .catch(err => { handle(err, res); });
      }
      else { res.status(404).end(); }
    })
    .catch(err => { handle(err, res); });
};
sendRecoveryCode = (req, res) => {
  const { username } = req.params;
  const code = randomKey(7, 62);

  pool.query("SELECT * FROM users WHERE username = $1", [username])
    .then(data => {
      if (data.rowCount < 1) res.status(404).end();
      else if (data.rows[0].email === "") res.status(410).end();
      else {
        data = data.rows[0];
        pool.query("INSERT INTO recovery (userid, code) VALUES ($1, $2)", [data.id, code])
          .then(() => {
            const { email, light, color } = data;
            fs.readFile("./json/themes.json", (err, data) => {
              if (err) handle(err);
              else {
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
                mail.recover(res, email, username, newTheme, code, path(req));
              }
            });
          });
      }
    })
    .catch(err => { handle(err, res); });
};
getRecoveryCode = (req, res) => {
  const { username, code } = req.body;

  pool.query("(SELECT id FROM users WHERE username = $1) INTERSECT (SELECT userid FROM recovery WHERE code = $2)", [username, code])
    .then(data => {
      if (data.rowCount > 0) res.status(204).end();
      else res.status(401).end();
    })
    .catch(err => { handle(err, res); });
};
update.fromPasswordRecovery = (req, res) => {
  const { username, password, code } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      pool.query("UPDATE users SET password = $1 WHERE id = ((SELECT id FROM users WHERE username = $2) INTERSECT (SELECT userid FROM recovery WHERE code = $3)) RETURNING id", [hash, username, code])
        .then(data => {
          login(req, res, data.rows[0].id)
            .then(() => { res.status(204).end(); });
        });
      
    })
    .catch(err => { handle(err, res); });
};
secure = async (req, res) => {
  try {
    const data = await Promise.all([
      pool.query("DELETE FROM recovery WHERE userid = $1", [req.user.id]),
      pool.query("DELETE FROM sessions WHERE userid = $1 AND NOT sessionid = $2", [req.user.id, req.session.user]),
      pool.query("DELETE FROM confirm WHERE userid = $1", [req.user.id])
    ]);
    const num = await data.reduce((a, b) => a + b.rowCount, 0);
    res.render("./secure", { user: (req.user) ? req.user : false, here: req.originalUrl, num }, (error, html) => {
      if (html) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(html);
        res.end();
      }
      else throw error;
    });
  }
  catch (err) {
    res.writeHead(500, { "Content-Type": "text/html" });
    res.write(`Something Broke<br>${JSON.stringify(err).replace(/"/g, "")}`);
    res.end();
  }
};
hasEmail = (req, res) => {
  /*//console.log("checked email");
  const id = req.user.id;
  pool.query("SELECT email FROM users WHERE id = $1", [id])
    .then(data => {
      if (data.rows[0] ? data.rows[0].email : false) res.status(204).end();
      else res.status(404).end();
    })
    .catch(err => { handle(err, res); });*/
  res.status(200).set({
    "connection": "keep-alive",
    "cache-control": "no-cache",
    "content-Type": "text/event-stream"
  });
  event.on("email-confirmed", id => {
    console.log(id);
    console.log(req.user.id);
    if (id === req.user.id) {
      console.log("the same");
      res.write("Confirmed\n\n");
    }
    else {
      console.log("different");
    }
  });
};
const removeEmail = (req, res) => {
  pool.query("UPDATE users SET email = NULL WHERE id = $1", [req.user.id])
    .then(res.status(204).end())
    .catch(err => { handle(err, res); });
};
const remove = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id])
    .then(() => {
      res.status(204).end();
    })
    .catch(err => { handle(err, res); });
};
const logout = (req, res) => {
  req.session.reset();
  res.redirect(path(req).query.u);
};
const add = (req, res) => {
  const { content, type } = req.body;
  //const d = new Date();

  pool.query("INSERT INTO sugestions (content, type, by, created) VALUES ($1, $2, $3, $4)", [content, type, (req.user) ? req.user.username : null, "now"])
    .then(() => {
      res.status(201).end();
    })
    .catch(err => { handle(err, res); });
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
    .catch(err => { handle(err, res); });
};
const getSession = (sessionId, callback) => {
  pool.query("SELECT userid FROM sessions WHERE sessionid = $1", [sessionId], (err, data) => {
    if (err) {
      callback(false);
      console.error(err);
    }
    else if (data.rows) {
      callback(data.rows[0].userid);
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
    secure,
    remove,
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