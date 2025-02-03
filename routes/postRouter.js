const express = require("express");
const { validatePost, sanitizeInput } = require("../middleware/validators");
const { submitPost, deletePost } = require("../controllers/postController");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/", isAuth, (req, res) => res.render("post"));

router.post("/", isAuth, sanitizeInput, validatePost, submitPost);

router.post("/:id/delete", isAuth, deletePost);

module.exports = router;
