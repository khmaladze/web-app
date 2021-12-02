const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireAdminLogin = require("../middleware/requireAdminLogin");

// check if email is valid
function isValidEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email.toLowerCase()
  );
}

// check if email clients are gmail or yahoo
function isValidEmailClient(email) {
  return /.+@(gmail)\.com$/.test(email.toLowerCase());
}

///////////////////////////
// /* Register admin */  //
///////////////////////////
// router.post("/register", async (req, res) => {
//   // get from body
//   const { email, password } = req.body;

//   // check if fields not empty
//   if (!email || !password) {
//     return res
//       .status(422)
//       .json({ success: false, error: "please add all the fields" });
//   }

//   //check if email length is more than 90
//   if (email.length > 90) {
//     return res
//       .status(422)
//       .json({ success: false, error: "email must be max 90" });
//   }

//   // check if email is valid
//   if (!isValidEmail(email)) {
//     return res.status(422).json({ success: false, error: "Invalid email" });
//   }

//   // check if email clients are gmail or yahoo
//   if (!isValidEmailClient(email)) {
//     return res.status(422).json({
//       success: false,
//       error: "only @gmail.com allowed",
//     });
//   }

//   // check password
//   if (password.length <= 15 || password.length >= 101) {
//     return res.status(422).json({
//       success: false,
//       error: "password must be min 16 and max 100",
//     });
//   }

//   // check if admin exist with this email
//   const userEmailExist = await Admin.findOne({ email: email });
//   if (userEmailExist) {
//     return res.status(400).json({
//       success: false,
//       error: "Invalid Credentials. you can't register",
//     });
//   }

//   // register admin
//   let admin = new Admin({
//     email,
//     password: bcrypt.hashSync(req.body.password, 12),
//   });

//   // save admin
//   admin = await admin.save();

//   // check if created or not
//   if (!admin) {
//     return res.status(400).json({ error: "can't create admin" });
//   }

//   // send admin
//   res
//     .status(200)
//     .json({ success: true, message: "successfully register", admin: admin });
// });

///////////////////////////
// /* Login admin */  //
///////////////////////////
router.post("/login", async (req, res) => {
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
  if (!isValidEmailClient(email)) {
    return res.status(422).json({
      success: false,
      error: "only @gmail.com allowed",
    });
  }

  // admin
  let admin = await Admin.findOne({ email: email });

  // check if admin exist
  if (!admin) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid Credentials" });
  }

  // jwt secret
  const jwt_secret = process.env.ADMIN_SECRET;

  // admin data to json
  if (admin && bcrypt.compareSync(password, admin.password)) {
    const token = jwt.sign({ _id: admin._id }, jwt_secret);
    const { _id, email } = admin;
    res.json({
      success: true,
      token,
      admin: { _id, email },
    });
  }
});

///////////////////////////
// /* GET all User */    //
///////////////////////////
router.get("/allusers", requireAdminLogin, async (req, res) => {
  const user = await User.find();

  if (!user) {
    return res.status(400).json({ success: false, error: "can't get data" });
  }

  res.status(200).json({ success: true, users: user });
});

///////////////////////////
// /* GET User By Id */  //
///////////////////////////
router.get("/user/:id", requireAdminLogin, async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id }).select("-password");
    if (!user) {
      res.status(200).json({ success: false, message: "User not Found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* Block User  */     //
///////////////////////////
router.put("/user/block/:id", requireAdminLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* Unblock User  */   //
///////////////////////////
router.put("/user/unblock/:id", requireAdminLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.send(user);
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* GET all Post */    //
///////////////////////////
router.get("/allposts", requireAdminLogin, async (req, res) => {
  try {
    const post = await Post.find();

    if (!post) {
      return res.status(400).json({ success: false, error: "can't get data" });
    }

    res.status(200).json({ success: true, posts: post });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* GET Post By Id*/   //
///////////////////////////
router.get("/post/:id", requireAdminLogin, async (req, res) => {
  try {
    const post = await Post.find({ _id: req.params.id }).populate(
      "postedBy",
      "_id firstName lastName email birthDay username"
    );

    if (!post) {
      res.status(500).json({ success: false });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

module.exports = router;
