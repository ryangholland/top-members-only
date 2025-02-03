const express = require("express");
const path = require("path");
require("dotenv").config();

const session = require("express-session");
const passport = require("./config/passport");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");

const { setCurrentUser, fetchPosts } = require("./middleware/globals");
const errorHandler = require("./middleware/errorHandler");

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

app.use(setCurrentUser);
app.use(fetchPosts);

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/post", postRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`App listening on port ${PORT}...`));
