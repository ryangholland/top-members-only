const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const passport = require("./config/passport");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const errorHandler = require("./middleware/errorHandler");
const { getAllPosts } = require("./models/postModel");

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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use(async (req, res, next) => {
  if (req.user) {
    try {
      res.locals.posts = await getAllPosts();
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.locals.posts = [];
    }
  } else {
    res.locals.posts = [];
  }
  next();
});

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/post", postRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`App listening on port ${PORT}...`));
