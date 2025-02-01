const express = require("express");
const {
  validateUserSignup,
  checkUsernameExists,
  sanitizeInput,
} = require("../middleware/validators");
const { signUp } = require("../controllers/authController");

const router = express.Router();

router.post(
  "/sign-up",
  sanitizeInput,
  validateUserSignup,
  checkUsernameExists,
  signUp
);

module.exports = router;
