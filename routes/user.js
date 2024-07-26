const { Router } = require("express");
const User = require("../models/user");
const router = Router();

const blog = require("../models/blog");

const {
  changepasswordshandlear,
  signuphandlear,
  signinhandlear
} = require("./handlears/user.handlears");

router.get("/signin", (req, res) => {
  return res.render("signin", { error: "" });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.get("/signout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});
router.post("/signin", signinhandlear);
router.post("/signup", signuphandlear);

router.get("/profile/:id", async (req, res) => {
  const allBlogs = await blog
    .find({ createdBy: req.params.id })
    .sort({ createdAt: -1 })
    .populate("createdBy");
  // const allblogs = await Blog.find({ createdBy: req.params.id}).sort({'createdAt': -1});
  res.render("profile", {
    // user: req.user,
    allblogs: allBlogs,
  });
});

/*for api testing */
const apirouter = Router();
router.use("/api", apirouter);

apirouter.get("/changepassword", (req, res) => {
  if (!req.user) res.redirect("/user/signin");
  return res.render("changePassword", { user: req.user });
});
apirouter.post("/changepassword", changepasswordshandlear);

module.exports = router;
