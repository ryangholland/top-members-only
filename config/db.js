const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "ryan",
  database: "members_only",
  password: "password",
  port: 5432,
});

module.exports = pool;
