const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.render("index"));

router.get("/sign-up", (req, res) => res.render("sign-up"));

router.get("/log-in", (req, res) => res.render("log-in"));

module.exports = router;
