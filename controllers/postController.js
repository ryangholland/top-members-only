const { createPost } = require("../models/postModel");

async function submitPost(req, res, next) {
  const { title, content } = req.body;

  try {
    await createPost(req.user.id, title, content);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

module.exports = { submitPost };
