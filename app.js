require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT ;
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"));
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const User = require("./models/user");
const Blog = require("./models/blog");

const path = require("path");
const { checkforauthCookies } = require("./middlewares/auth");
const { verifyToken } = require("./services/auth");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkforauthCookies());

app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allblogs = await Blog.find()
    .sort({ createdAt: -1 })
    .populate("createdBy");
  res.render("home", {
    user: req.user,
    allblogs: allblogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => {
  console.log("Surver is started at Port : " + PORT);
});
