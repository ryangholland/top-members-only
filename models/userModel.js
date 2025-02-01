const pool = require("../config/db");
const bcrypt = require("bcryptjs");

async function createUser(first_name, last_name, username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, username, password, membership_status) VALUES ($1, $2, $3, $4, DEFAULT)",
      [first_name, last_name, username, hashedPassword]
    );
    return result;
  } catch (error) {
    if (error.code === "23505") { // Unique constraint violation (duplicate username)
      throw new Error(
        "Username already exists. Please choose a different one."
      );
    }
    throw error;
  }
}

module.exports = { createUser };
