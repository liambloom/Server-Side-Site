"use strict"; // change at some point to use async/await
const { bcrypt, uuid, pool, path, handle, fs, randomKey, mail } = require("./initPool");

const createTable = () => {
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
const login = async (req, userid) => {
  const id = uuid();
  pool.query("INSERT INTO sessions (sessionid, userid) VALUES ($1, $2)", [id, userid]);
  req.session.user = id;
  return;
};
const newUser = async(req, res, id, username, password, email, color, light) => {
  try {
    pool.query("INSERT INTO users (id, username, password, email, color, light, type, since) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [id, username, password, email, color, light, "USER", "today"]);
    await login(req, id);
    res.status(201).end();
  }
  catch (err) { handle(err, res); }
};
const theme =  (color, light) => {
  let newTheme = 2;
  let data = fs.readFileSync("./json/themes.json");
  const theme = JSON.parse(data)[color];
  newTheme = {
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
  return newTheme;
};
const getAll = async(req, res) => {
  try {
    let data = await pool.query("SELECT * FROM users");
    for (let row of data.rows) {
      delete row.id;
      delete row.password;
    }
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
    else throw "No Users";
  }
  catch (err) { handle(err, res); }
};
const get = async (id) => {
  try {
    let res = await (await pool.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];
    delete res.password;
    return res;
  }
  catch (err) { console.error(err); }
};
const confirm = async (req, res) => {
  const {username, password} = req.body;

  const data = await pool.query("SELECT id, password FROM users WHERE username=$1", [username]);
  try {
    if (data.rowCount > 0) {
      const user = data.rows[0];
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        login(req, user.id);
        res.status(204).end();
      }
      else res.status(403).end();
    }
    else res.status(401).end();
  }
  catch (err) { handle(err, res); }
};
const create = async (req, res) => {
  try {
    const { username, password, email, color, light } = await req.body;
    const { hash, id, user } = await Promise.all({
      hash: bcrypt.hash(password, 10), 
      id: uuid(), 
      user: pool.query("SELECT id FROM users WHERE username = $1", [username])
    });
    if (user.rows[0]) res.status(409).end();
    else {
      if (!email) newUser(req, res, id, username, hash, email, color, light);
      else {
        const code = uuid();
        pool.query("INSERT INTO confirm (userid, code, email) VALUES ($1, $2, $3)", [id, code, email]);
        const site = path(req);
        mail("confirm", "Confirm Email for " + site.hostname, email, {
          ...theme(color, light),
          username,
          code,
          site: `${site.protocol}//${site.host}`
        });
        newUser(req, res, id, username, hash, null, color, light);
      }
    }
  }
  catch (err) { handle(err, res); }
};
const update = async (req, res) => {
  const { id, username, color, light } = req.user;
  const { password, category, value } = req.body;
  if (/id|username|since/.test(category)) res.status(405).send("These categories cannot be updated").end();
  else if (category === "type" && req.user.type !== "ADMIN") res.status(403).send("This is an admin only action").end();
  else {
    let func = async (override) => {
      try {
        pool.query(`UPDATE users SET ${category} = $1 WHERE id = $2`, [override || value, id]);
        res.status(204).end();
      }
      catch (err) { handle(err, res); }
    };
    if (category === "password") {
      try {
        const data = await pool.query("SELECT password FROM users WHERE id = $1", [id]);
        const result = await bcrypt.compare(password, data.rows[0].password);
        if (result) {
          const hash = await bcrypt.hash(value, 10);
          func(hash);
        }       
        else res.status(403).end();
      }
      catch (err) { handle(err, res); }
    }
    else if (category === "email") {
      try {
        const code = uuid();
        pool.query("INSERT INTO confirm (userid, code, email) VALUES ($1, $2, $3)", [id, code, value]);
        const site = path(req);
        mail("update", "Confirm Email for " + site.hostname, value, {
          ...theme(color, light),
          username,
          code,
          site: `${site.protocol}//${site.host}`
        });
        res.status(201).end();
      }
      catch (err) { handle(err, res); }
    }
    else func(null);
  }
};
update.fromEmailConfirm = async (req, res) => {
  try {
    const id = req.params.addId;
    let data = await pool.query("UPDATE users SET email = (SELECT email FROM confirm WHERE code = $1) WHERE id = (SELECT userid FROM confirm WHERE code = $1)", [id]);
    if (data.rowCount >= 1) {
      data = await pool.query("DELETE FROM confirm WHERE code = $1 RETURNING userid", [id]);
      if (data.rows[0] ? !data.rows[0].userid : true) {
        throw "No user id found";
      }
      else {
        const id = data.rows[0].userid;
        global.event.emit("email-confirmed", id);
        login(req, id);
        res.redirect(303, "/");
      }
    }
    else { res.status(404).end(); }
  }
  catch (err) { handle(err, res); }
};
let sendRecoveryCode = async (req, res) => {
  try {
    const { username } = req.params;
    const code = randomKey(7, 62);

    let data = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (data.rowCount < 1) res.status(404).end();
    else if (data.rows[0].email === null) res.status(410).end();
    else {
      data = data.rows[0];
      pool.query("INSERT INTO recovery (userid, code) VALUES ($1, $2)", [data.id, code]);
      const { email, light, color } = data;
      const site = path(req);
      mail("recovery", "Recover Account for " + site.hostname, email, {
        ...theme(color, light),
        username,
        code,
        site: `${site.protocol}//${site.host}`
      });
      res.status(201).end();
    }
  }
  catch (err) { handle(err, res); }
};
const getRecoveryCode = async (req, res) => {
  try {
    const { username, code } = req.body;
    const data = await pool.query("(SELECT id FROM users WHERE username = $1) INTERSECT (SELECT userid FROM recovery WHERE code = $2)", [username, code]);
    if (data.rowCount > 0) res.status(204).end();
    else res.status(401).end();
  }
  catch (err) { handle(err, res); }
};
update.fromPasswordRecovery = async (req, res) => {
  try {
    const { username, password, code } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const data = await pool.query("UPDATE users SET password = $1 WHERE id = ((SELECT id FROM users WHERE username = $2) INTERSECT (SELECT userid FROM recovery WHERE code = $3)) RETURNING id", [hash, username, code]);
    login(req, data.rows[0].id);
    res.status(204).end();
  }
  catch (err) { handle(err, res); }
};
const secure = async (req, res) => {
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
const hasEmail = (req, res) => {
  global.event.on("email-confirmed", id => {
    if (id === req.user.id) res.status(200).end();
  });
};
const removeEmail = (req, res) => {
  try {
    pool.query("UPDATE users SET email = NULL WHERE id = $1", [req.user.id]);
    res.status(204).end();
  }
  catch (err) { handle(err, res); }
};
const remove = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(204).end();
  }
  catch (err) { handle(err, res); }
};
const logout = async (req, res) => {
  await Promise.all([
    pool.query("DELETE FROM recovery WHERE userid = $1", [req.user.id]),
    //pool.query("DELETE FROM sessions WHERE userid = $1 AND NOT sessionid = $2", [req.user.id, req.session.user]),
    pool.query("DELETE FROM confirm WHERE userid = $1", [req.user.id])
  ]);
  req.session.reset();
  res.redirect(path(req).query.u);
};
const forbiddenVerify = async (req, res) => {
  try {
    if (!UUID_REGEX.test(req.body.key)) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.write(JSON.stringify({error: "Invalid Key"}));
      res.end();
    }
    else if ((await pool.query("UPDATE forbidden_keys SET users = users + 1 WHERE key = $1", [req.body.key])).rowCount) {
      req.forbiddenKey.key = req.body.key;
      res.status(204).end();
      if (req.user) pool.query("UPDATE users SET forbidden_permission = TRUE WHERE id = $1", [req.user.id]);
    }
    else {
      res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
      res.write(JSON.stringify({error: "Key rejected"}));
      res.end();
    }
  }
  catch (err) { handle(err, res); }
};
const add = (req, res) => {
  try {
    const { content, type } = req.body;
    pool.query("INSERT INTO sugestions (content, type, by, created) VALUES ($1, $2, $3, $4)", [content, type, (req.user) ? req.user.username : null, "now"]);
    res.status(201).end();
  }
  catch (err) { handle(err, res); }
};
const getSugestions = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM sugestions");
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
  }
  catch (err) { handle(err, res); }
};
const newSugestions = async () => {
  try {
    let data = await pool.query("SELECT type FROM sugestions WHERE DATE_PART('day', now() - created) < 1");
    if (data.rowCount > 0) {
      let string = "";
      const counter = {
        Sugestion: 0,
        Issue: 0,
        Question: 0,
        Other: 0
      };
      const keyString = (key) => key[1] + " new " + key[0].toLowerCase() + ((key >= 2) ? "s" : "");
      data.rows.forEach(row => {
        counter[row.type]++;
      });
      const keys = Object.entries(counter).filter(e => e[1] > 0);
      const length = keys.length;
      if (length === 1) string = keyString(keys[0]);
      else if (length === 2) string = keyString(keys[0]) + " and " + keyString(keys[1]);
      else {
        keys.forEach(key => {
          string += keyString(key) + ", ";
        });
        string = string.replace(/, $/, "").replace(/,(?=[^,]+$)/, ", and");
      }
      data = await pool.query("SELECT * FROM users WHERE type = 'ADMIN'");
      data.emails = [];
      data.rows.forEach(e => {
        data.emails.push(e.email);
      });
      mail("sugestions", "New sugestions for your site", data.emails, {
        ...theme(data.rows[0].color, data.rows[0].light),
        username: (data.emails.length > 1) ? "Admins" : data.rows[0].username,
        info: string,
        site: "https://liambloom.herokuapp.com"
      });
    }
  }
  catch (err) { console.error(err); }
};
const getSession = async (sessionId) => {
  try {
    const data = await pool.query("SELECT userid FROM sessions WHERE sessionid = $1", [sessionId]);
    if (data.rowCount) {
      return data.rows[0].userid;
    }
    else return false;
  }
  catch (err) {
    console.error(err);
    return false;
  }
};
const forbiddenProtection = async (req) => {
  try {
    if (req.user && req.user.forbidden_permission) return true;
    else if (req.forbiddenKey && req.forbiddenKey.key) return await (await pool.query("SELECT * FROM forbidden_keys WHERE key = $1", [req.forbiddenKey.key])).rowCount;
    else return false;
  }
  catch (err) {
    console.error(err);
    return false;
  }
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
    get: getSugestions,
    getNew: newSugestions
  },
  session: {
    get: getSession
  },
  forbidden: {
    protection: forbiddenProtection,
    verify: forbiddenVerify
  }
};