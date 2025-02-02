const express = require("express");
const passport = require("passport");
const {
  validateUserSignup,
  sanitizeInput,
} = require("../middleware/validators");
const {
  signUp,
  joinClub,
  leaveClub,
  logOut,
} = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/sign-up", sanitizeInput, validateUserSignup, signUp);

// Need to create callback function in authController
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

router.get("/join", isAuth, (req, res) => res.render("join"));

router.post("/join", isAuth, joinClub);

router.get("/leave", isAuth, leaveClub);

router.get("/log-out", isAuth, logOut);

module.exports = router;
