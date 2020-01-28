CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL,
  username varchar(100) UNIQUE NOT NULL,
  password varchar(100) NOT NULL,
  email varchar(50),
  color varchar(15),
  light varchar(5),
  type varchar(12) NOT NULL,
  since date NOT NULL,
  forbidden_permission boolean DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS sugestions (
  content varchar(500) NOT NULL,
  type varchar(10) NOT NULL,
  by varchar(100),
  created timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  sessionid uuid NOT NULL,
  userid uuid NOT NULL
);
CREATE TABLE IF NOT EXISTS confirm (
  userid uuid NOT NULL,
  code uuid NOT NULL,
  email varchar(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS recovery (
  userid uuid NOT NULL,
  code varchar(7) NOT NULL
);
CREATE TABLE IF NOT EXISTS countdowns (
  id uuid NOT NULL,
  name varchar(50) NOT NULL,
  calendar varchar(9) NOT NULL,
  icon varchar(40) NOT NULL,
  bg varchar(15),
  owner uuid NOT NULL,
  timing varchar(50),
  message varchar(50)
);
CREATE TABLE IF NOT EXISTS sets (
  setid uuid NOT NULL,
  userid uuid NOT NULL,
  term VARCHAR(20),
  deff VARCHAR(20),
  private boolean,
  name VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS cards (
  setid uuid,
  term VARCHAR(100),
  deff VARCHAR(100)
);
CREATE TABLE IF NOT EXISTS forbidden_keys (
  key uuid NOT NULL,
  users INTEGER DEFAULT 0
);