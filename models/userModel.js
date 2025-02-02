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
    if (error.code === "23505") {
      // Unique constraint violation (duplicate username)
      throw new Error(
        "Username already exists. Please choose a different one."
      );
    }
    throw error;
  }
}

async function getUserByUsername(username) {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
}

// membership_status can be regular, premium, or admin
async function updateUserMembership(userId, newStatus) {
  try {
    const result = await pool.query(
      "UPDATE users SET membership_status = $1 WHERE id = $2 RETURNING *",
      [newStatus, userId]
    );
    return result.rows[0]; // Return the updated user
  } catch (error) {
    console.error("Error updating membership status:", error);
    throw error;
  }
}

module.exports = { createUser, getUserByUsername, updateUserMembership };
