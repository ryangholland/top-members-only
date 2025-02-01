const { createUser } = require("../models/userModel");

async function signUp(req, res, next) {
  const { first_name, last_name, username, password } = req.body;
  try {
    await createUser(first_name, last_name, username, password);
    console.log(`User ${username} created successfully.`);
    res.redirect("/");
  } catch (error) {
    console.error(error);

    return res.render("sign-up", {
      error: error.message || "An unexpected error occurred",
      first_name,
      last_name,
      username,
    });
  }
}

function logOut(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

module.exports = { signUp, logOut };
