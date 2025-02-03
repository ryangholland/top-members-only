const { getAllPosts } = require("../models/postModel");

const setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

const fetchPosts = async (req, res, next) => {
  if (req.user) {
    try {
      res.locals.posts = await getAllPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.locals.posts = [];
    }
  } else {
    res.locals.posts = [];
  }
  next();
};

module.exports = { setCurrentUser, fetchPosts };
