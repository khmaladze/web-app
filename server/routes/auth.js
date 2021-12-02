const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// check if email is valid
function isValidEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email.toLowerCase()
  );
}

// check if email clients are gmail or yahoo
function isValidGmailProvider(email) {
  return /.+@(gmail)\.com$/.test(email.toLowerCase());
}

///////////////////////////
// /* Register users */  //
///////////////////////////
router.post("/register", async (req, res) => {
  try {
    // get from body
    let {
      firstName,
      lastName,
      email,
      birthDay,
      username,
      password,
      confirmPassword,
    } = req.body;

    // check if text contain number
    const hasNumber = /\d/;

    // check if fields not empty
    if (
      !firstName ||
      !lastName ||
      !email ||
      !birthDay ||
      !username ||
      !password ||
      !confirmPassword
    ) {
      return res
        .status(422)
        .json({ success: false, error: "please add all the fields" });
    }

    // check if firstName and lastName is valid
    if (hasNumber.test(firstName) || hasNumber.test(lastName)) {
      return res.status(422).json({
        success: false,
        error: "firstName and lastName must be only text",
      });
    }

    // check if firstName is valid
    if (firstName.length == 1 || firstName.length > 20) {
      return res
        .status(422)
        .json({ success: false, error: "firstName must be min 2 and max 20" });
    }

    // check if lastName is valid
    if (lastName.length == 1 || lastName.length > 20) {
      return res
        .status(422)
        .json({ success: false, error: "lastName must be min 2 and max 30" });
    }

    //check if email length is more than 90
    if (email.length > 90) {
      return res
        .status(422)
        .json({ success: false, error: "email must be max 90" });
    }

    // check if email is valid
    if (!isValidEmail(email)) {
      return res.status(422).json({ success: false, error: "Invalid email" });
    }

    // check if email clients are gmail
    if (!isValidGmailProvider(email)) {
      return res.status(422).json({
        success: false,
        error: "only @gmail.com allowed",
      });
    }

    // check if birthDay length is valid
    if (!(birthDay.length == 10)) {
      return res.status(422).json({
        success: false,
        error: "please use Valid Date",
      });
    }

    // check if birthDay date is valid
    if (birthDay.length == 10) {
      const year = birthDay.slice(0, 4);
      const month = birthDay.slice(5, 7);
      const day = birthDay.slice(8, 10);

      if (Number(month) > 12) {
        return res.status(422).json({
          success: false,
          error: "please use Valid Month",
        });
      }

      if (Number(day) > 31) {
        return res.status(422).json({
          success: false,
          error: "please use Valid Day",
        });
      }

      if (Number(month) == 2 && (Number(day) == 30 || Number(day) == 31)) {
        return res.status(422).json({
          success: false,
          error: "please use Valid Date",
        });
      }
    }

    // check if user length is more than 50
    if (username.length > 50) {
      return res.status(422).json({
        success: false,
        error: "username must be max 50",
      });
    }

    // check password
    if (password.length <= 15 || password.length >= 101) {
      return res.status(422).json({
        success: false,
        error: "password must be min 16 and max 100",
      });
    }

    // check if password is same as confirmPassword
    if (!(password == confirmPassword)) {
      return res.status(422).json({
        success: false,
        error: "passwords not match. please confirm password",
      });
    }

    // check if user exist with this email
    const userEmailExist = await User.findOne({ email: email });
    if (userEmailExist) {
      return res.status(400).json({
        success: false,
        error: "Invalid Credentials. you can't register",
      });
    }

    // check if user exist
    const userExist = await User.findOne({ username: username });
    if (userExist) {
      return res.status(400).json({
        success: false,
        error: "Invalid Credentials. you can't register",
      });
    }

    // register user
    let user = new User({
      firstName,
      lastName,
      email,
      birthDay,
      username,
      password: bcrypt.hashSync(req.body.password, 12),
    });

    // save user
    user = await user.save();

    // check if created or not
    if (!user) {
      return res.status(400).json({ error: "can't create user" });
    }

    // send user
    res
      .status(200)
      .json({ success: true, message: "successfully register", user: user });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* Login users */  //
///////////////////////////
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if fields not empty
    if (!email || !password) {
      return res.status(400).json({ error: "please add all the fields" });
    }

    // check if email is valid
    if (!isValidEmail(email)) {
      return res.status(422).json({ success: false, error: "Invalid email" });
    }

    // check if email clients are gmail or yahoo
    if (!isValidGmailProvider(email)) {
      return res.status(422).json({
        success: false,
        error: "only @gmail.com allowed",
      });
    }

    // user
    let user = await User.findOne({ email: email });

    // check if user exist
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });
    }

    // check if user is blocked
    if (user.isBlocked == true) {
      return res.status(400).json({ success: false, error: "you can't login" });
    }

    // jwt secret
    const jwt_secret = process.env.JWT_SECRET;

    // user data to json
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      const {
        _id,
        firstName,
        lastName,
        email,
        birthDay,
        username,
        image,
        backgroundImage,
        biography,
        isFeatured,
        followers,
        following,
      } = user;

      res.json({
        success: true,
        token,
        user: {
          _id,
          firstName,
          lastName,
          email,
          birthDay,
          username,
          image,
          backgroundImage,
          biography,
          isFeatured,
          followers,
          following,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

module.exports = router;
