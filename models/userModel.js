const pool = require("../config/db");
const bcrypt = require("bcryptjs");

async function createUser(first_name, last_name, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, DEFAULT)",
    [first_name, last_name, username, hashedPassword]
  );
}

module.exports = { createUser };
