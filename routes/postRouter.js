const express = require("express");
const { sanitizeInput } = require("../middleware/validators");
const { submitPost } = require("../controllers/postController")
const isAuth = require("../middleware/isAuth");
const router = express.Router();

router.get("/", isAuth, (req, res) => res.render("post"))

router.post("/", isAuth, sanitizeInput, submitPost)

module.exports = router;