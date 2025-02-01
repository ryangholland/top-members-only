const { body, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
const pool = require("../config/db");

const validateUserSignup = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name should contain only letters")
    .isLength({ min: 2, max: 30 })
    .withMessage("First name should be between 2 and 30 letters"),

  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name should contain only letters")
    .isLength({ min: 2, max: 30 })
    .withMessage("Last name should be between 2 and 30 letters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username should contain only letters and numbers")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username should be between 2 and 20 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirm_password")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const checkUsernameExists = async (req, res, next) => {
  try {
    const { username } = req.body;
    const result = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length > 0) {
      return res
        .status(400)
        .json({ error: "Username already exists. Choose a different one." });
    }

    next();
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const sanitizeInput = (req, res, next) => {
  req.body.first_name = sanitizeHtml(req.body.first_name);
  req.body.last_name = sanitizeHtml(req.body.last_name);
  req.body.username = sanitizeHtml(req.body.username);
  next();
};

module.exports = { validateUserSignup, checkUsernameExists, sanitizeInput };
