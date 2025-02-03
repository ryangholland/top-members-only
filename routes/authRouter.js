const express = require("express");
const {
  validateUserSignup,
  sanitizeInput,
} = require("../middleware/validators");
const {
  signUp,
  logIn,
  joinClub,
  becomeAdmin,
  leaveClub,
  logOut,
} = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post("/sign-up", sanitizeInput, validateUserSignup, signUp);

router.post("/log-in", sanitizeInput, logIn)

router.get("/join", isAuth, (req, res) => res.render("join"));
router.post("/join", isAuth, joinClub);

router.get("/admin", isAuth, (req, res) => res.render("admin"));
router.post("/admin", isAuth, becomeAdmin)

router.get("/leave", isAuth, leaveClub);

router.get("/log-out", isAuth, logOut);

module.exports = router;
