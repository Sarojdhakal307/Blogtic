const { Router } = require("express");
const User = require("../../models/user");
const router = Router();
const { createHmac } = require("crypto");
const nodemailer = require("nodemailer");

const {createTokenForUser} = require("../../services/auth")

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sarojdhakal307@gmail.com",
    pass: "sggt tsqe jzsb sawj",
  },
});

async function changepasswordshandlear(req, res, next) {
  if (req.user) {
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    // const {currentPassword,newPassword}= req.body;
    /*
            check current password and new password
        */
    if (!currentPassword && !newPassword) {
      return res
        .status(400)
        .json({ message: "currentPassword & newPassword required" });
    }

    /*
            check curreet password is valid or not
        */
    const user = await User.findOne({ _id: req.user._id });
    console.log("user :", user);
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = createHmac("sha256", salt)
      .update(currentPassword)
      .digest("hex");
    //check Current password
    if (hashedPassword != user.password) {
      console.log("Invallide current password");
      return res.json({ message: "Invallide current password" });
    } else {
      console.log("currect current password");
    }
    //check Currentpassword and newpassword is same or not
    if (currentPassword == newPassword) {
      return res.json({
        message: "currentPassword & newPassword cant be same",
      });
    }
    // const password = newPassword;
    const newhashedPassword = createHmac("sha256", salt)
      .update(newPassword)
      .digest("hex");
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { password: newhashedPassword },
      { new: true } // Return the updated document
    );

    if (updatedUser) {
      console.log("password Updated !");
      return res.json({ message: "password Updated" });
    } else {
      res.status(400).json({ msg: "XX something wrong" });
    }
  } else {
    res.status(400).json({ msg: "user invalide" });
  }
}

async function signinhandlear(req, res, next) {
    const { email, password } = req.body;
    console.log("Email:", email, "Password:", password);
  
    try {
      if (!email || !password) {
        return res.render("signin", { error: "Email and password are required" });
      }
  
      const token = await User.matchPasswordAndGeneratedToken(email, password);
  
      console.log("Generated Token:", token);
  
      return res.cookie("token", token).redirect("/");
    } catch (err) {
      console.error("Signin Error:", err);
      return res.render("signin", { error: "your input is not Correct !" });
    }

}

async function signuphandlear(req, res, next) {
  const { fullname, email, password } = req.body;
  try {
    await User.create({ fullname, email, password }).then(function () {
      var mailOptions = {
        from: "sarojdhakal307@gmail.com",
        to: email,
        subject: "Welcome to Blogtic - You're  Signed Up!",
        text: `
            Hi ${fullname},

            Thank you for signing up for Blogtic! We're excited to have you on board and can't wait for you to explore all the features our platform offers.

            If you have any questions or need assistance, feel free to reach out!
            Happy blogging!

            Best,
            The Blogtic Team`,

      };
      transporter.sendMail(mailOptions,function(error,info){
        if (error) {
            console.error('Error sending email:', error);
            // Handle specific error types
            if (error.responseCode === 550) {
              console.log('Email address not found.');
              return res.json({ errormsg: 'Email address not found.' });
            } else {
              console.log('An error occurred:', error.message);
              return res.json({ errormsg: error,message});
            }
          } else {
            console.log('Email sent successfully:', info.response);
          }
    })
    });
    // return res.redirect("/");    
    try{
    const user = await User.findOne({email});
    console.log(user)
    const token =  createTokenForUser(user);
    res.cookie("token", token).redirect("/");
    // res.cookie("token", token);


    }catch (err) {
        return res.json({ msg: "email not found to generate token"});

    }

    return res.json({ msg: "Thank you for signedup"});
  } catch (err) {
    return res.render("signup", { error: "Email is already registered!" });
  }
}
module.exports = { changepasswordshandlear, signuphandlear,signinhandlear };
