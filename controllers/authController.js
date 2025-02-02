const { createUser, updateUserMembership } = require("../models/userModel");
const passport = require("passport");

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

async function logIn(req, res, next) {
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
}

async function joinClub(req, res, next) {
  const { passcode } = req.body;

  if (passcode === process.env.CLUB_PASSCODE) {
    try {
      await updateUserMembership(req.user.id, "premium");
      console.log(`Welcome to the club, ${req.user.first_name}`);
      res.redirect("/");
    } catch (error) {
      res.render("join", {
        error: "An unexpected error occurred",
      });
    }
  } else {
    res.render("join", {
      error: "Invalid passcode",
    });
  }
}

async function leaveClub(req, res, next) {
  try {
    await updateUserMembership(req.user.id, "regular");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
}

function logOut(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

module.exports = { signUp, logIn, joinClub, leaveClub, logOut };
