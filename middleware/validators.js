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
    .withMessage("Username should be between 2 and 20 characters")
    .custom(async (value) => {
      const result = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [value]
      );
      if (result.rows.length > 0) {
        return Promise.reject(
          "Username already exists. Please choose a different one."
        );
      }
      return true;
    }),

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
      return res.render("sign-up", {
        error: errors.array().map((err) => err.msg),

        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
      });
    }
    next();
  },
];

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 255 })
    .withMessage("Title should be between 3 and 255 characters"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Post content is required")
    .isLength({ min: 10 })
    .withMessage("Post content must be at least 10 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("post", {
        error: errors.array().map((err) => err.msg),
        title: req.body.title,
        content: req.body.content,
      });
    }
    next();
  },
];

const sanitizeInput = (req, res, next) => {
  try {
    ["first_name", "last_name", "username", "title", "content"].forEach((field) => {
      if (req.body[field]) {
        req.body[field] = sanitizeHtml(req.body[field]);
      }
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validateUserSignup, validatePost, sanitizeInput };
