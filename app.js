const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("./config/passport");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter")

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/", authRouter)

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`App listening on port ${PORT}...`));
