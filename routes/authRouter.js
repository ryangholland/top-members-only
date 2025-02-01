const express = require("express");
const {
  validateUserSignup,
  sanitizeInput,
} = require("../middleware/validators");
const { signUp } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", sanitizeInput, validateUserSignup, signUp);

module.exports = router;
