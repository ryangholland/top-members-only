const pool = require("../config/db");

async function createPost(userId, title, text) {
  try {
    const result = await pool.query(
      "INSERT INTO posts (user_id, title, text, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [userId, title, text]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

async function getAllPosts() {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.username 
         FROM posts 
         JOIN users ON posts.user_id = users.id
         ORDER BY timestamp DESC`
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

async function deletePostById(id) {
  await pool.query("DELETE FROM posts WHERE id = $1", [id]);
}

module.exports = { createPost, getAllPosts, deletePostById };
