const { createUser } = require("../models/userModel");

async function signUp(req, res, next) {
  try {
    await createUser(
      req.body.first_name,
      req.body.last_name,
      req.body.username,
      req.body.password
    );
    console.log(`User ${req.body.username} created successfully.`);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

function logOut(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

module.exports = { signUp, logOut };
