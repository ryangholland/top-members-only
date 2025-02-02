const express = require("express");
const passport = require("passport");
const {
  validateUserSignup,
  sanitizeInput,
} = require("../middleware/validators");
const { signUp, logOut } = require("../controllers/authController");

const router = express.Router();

router.post("/sign-up", sanitizeInput, validateUserSignup, signUp);

router.post("/log-in", sanitizeInput, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("log-in", {
        error: info ? info.message : "Invalid username or password.",
        username: req.body.username,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/log-out", logOut);

module.exports = router;
