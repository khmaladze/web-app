const express = require("express");
const requireUserLogin = require("../middleware/requireUserLogin");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Storie = mongoose.model("Storie");

///////////////////////////
// /* Get Profile */     //
///////////////////////////
router.get("/profile", requireUserLogin, async (req, res) => {
  try {
    const profilePost = await Post.find({ postedBy: req.user._id })
      .populate("postedBy", "_id firstName lastName createdAt")
      .sort("-createdAt");

    if (!profilePost) {
      return res.status(500).json("error");
    }

    res.send({ profilePost });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

//////////////////////////////////
// /* Update Profile img */     //
//////////////////////////////////
router.put("/profile/picture", requireUserLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { image: req.body.image } },
      { new: true }
    );

    if (!user) {
      return res.status(422).json({ error: "image not updated" });
    }

    if (user) {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

/////////////////////////////////////////////
// /* Update Profile background img */     //
/////////////////////////////////////////////
router.put(
  "/profile/background/picture",
  requireUserLogin,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { backgroundImage: req.body.backgroundImage } },
        { new: true }
      );

      if (!user) {
        return res.status(422).json({ error: "background image not updated" });
      }

      if (user) {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ success: "false", error: error });
    }
  }
);

/////////////////////////////////////////////
// /* Get Profile by username */           //
/////////////////////////////////////////////
router.get("/user/@:username", requireUserLogin, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isBlocked: false,
    });

    if (!user) {
      return res.status(422).json({ error: "user not found" });
    }

    // const post = await Post.find({ postedBy: { _id: user._id } })
    //   .populate("postedBy")
    //   .select("-password")
    //   .sort("-createdAt");

    // if (!post) {
    //   return res.status(422).json({ error: "post not found" });
    // }

    // res.json({ users: user, posts: post });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

/////////////////////////////////////////////
// /* Get Profile post by username */      //
/////////////////////////////////////////////
router.get("/user/post/@:username", requireUserLogin, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      isBlocked: false,
    });

    if (!user) {
      return res.status(422).json({ error: "user not found" });
    }

    const post = await Post.find({ postedBy: { _id: user._id } })
      .populate("postedBy")
      .select("-password")
      .sort("-createdAt");

    if (!post) {
      return res.status(422).json({ error: "post not found" });
    }

    res.json({ post });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

/////////////////////////////////////////////
// /* Get User */                          //
/////////////////////////////////////////////
// // change this /get_user
router.get("/getuser", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

/////////////////////////////////////////////
// /* Update Profile Biography*/           //
/////////////////////////////////////////////
router.put("/profile/biography", requireUserLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { biography: req.body.biography } },
      { new: true }
    );

    if (!user) {
      return res.status(422).json({ error: "biography not updated" });
    }

    if (user) {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

/////////////////////////////////////////////
// /* Update Profile IsFeatured */         //
/////////////////////////////////////////////
router.put("/profile/isfeatured", requireUserLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { isFeatured: req.body.isFeatured } },
      { new: true }
    );

    if (!user) {
      return res.status(422).json({ error: "isFeatured not updated" });
    }

    if (user) {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

/////////////////////////////////////////////
// /* Get Profile If Featured */           //
/////////////////////////////////////////////
router.get("/user/featured", requireUserLogin, async (req, res) => {
  try {
    const user = await User.find({
      _id: { $ne: req.user._id },
      isFeatured: true,
      isBlocked: false,
    })
      .populate("postedBy", "_id firstName lastName biography createdAt")
      .sort("-createdAt")
      .limit(5);

    if (!user) {
      return res.status(500).json("error");
    }

    res.send({ user });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

/////////////////////////////////////////////
// /* Follow User */                       //
/////////////////////////////////////////////
router.put("/user/follow", requireUserLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

/////////////////////////////////////////////
// /* UnFollow User */                     //
/////////////////////////////////////////////
router.put("/user/unfollow", requireUserLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

////////////////////////
// /* like Post */    //
////////////////////////
router.put("/like", requireUserLogin, async (req, res) => {
  try {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "-password")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          res.json(result);
        }
      });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

////////////////////////
// /* unlike Post */  //
////////////////////////
router.put("/unlike", requireUserLogin, (req, res) => {
  try {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "-password")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          res.json(result);
        }
      });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* Create storie */   //
///////////////////////////
router.post("/user/storie", requireUserLogin, async (req, res) => {
  try {
    const { text, photo, userCreatedAtLocalTime } = req.body;

    // check if text or photo is not empty
    if (!text && !photo && !userCreatedAtLocalTime) {
      return res.status(422).json({ error: "Please add all the fields" });
    }

    // check if userCreatedAtLocalTime is Exists
    if (!userCreatedAtLocalTime) {
      return res.status(422).json({
        success: false,
        error: "please add all the fields",
      });
    }

    // check if userCreatedAtLocalTime length is valid
    if (!(userCreatedAtLocalTime.length == 10)) {
      return res.status(422).json({
        success: false,
        error: "please use Valid Date",
      });
    }

    // check if userCreatedAtLocalTime date is valid
    if (userCreatedAtLocalTime.length == 10) {
      const year = userCreatedAtLocalTime.slice(0, 4);
      const month = userCreatedAtLocalTime.slice(5, 7);
      const day = userCreatedAtLocalTime.slice(8, 10);

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

    if (text && !photo) {
      // Check if text size is normal
      if (text.length >= 301) {
        return res.status(422).json({
          error: `Text  max length is 300. your text size is ${text.length} `,
        });
      }

      req.user.password = undefined;
      let storie = new Storie({
        text,
        userCreatedAtLocalTime,
        postedBy: req.user,
      });
      storie.expireToken = Date.now() + 90000000;
      storie = await storie.save();
      if (!storie) {
        return res.status(500).json({ error: "error" });
      }
      res.json({ storie });
    }
    if (!text && photo) {
      req.user.password = undefined;
      let storie = new Storie({
        photo,
        userCreatedAtLocalTime,
        postedBy: req.user,
      });
      storie.expireToken = Date.now() + 90000000;
      storie = await storie.save();
      if (!storie) {
        return res.status(500).json({ error: "error" });
      }
      res.json({ storie });
    }
    if (text && photo) {
      // Check if text size is normal
      if (text.length >= 301) {
        return res.status(422).json({
          error: `Text  max length is 300. your text size is ${text.length} `,
        });
      }
      req.user.password = undefined;
      let storie = new Storie({
        text,
        photo,
        userCreatedAtLocalTime,
        postedBy: req.user,
      });
      storie.expireToken = Date.now() + 90000000;
      storie = await storie.save();

      if (!storie) {
        return res.status(500).json({ error: "error" });
      }
      res.json({ storie });
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* GET all storie */  //
///////////////////////////
router.get("/allstorie", requireUserLogin, async (req, res) => {
  try {
    const storie = await Storie.find({
      expireToken: { $gt: Date.now() },
    })
      .populate("postedBy", "_id firstName lastName username image createdAt ")
      .sort("-createdAt");

    if (!storie) {
      return res.status(400).json({ success: false, error: "can't get data" });
    }

    res.status(200).json({ success: true, storie });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* GET Storie By Id*/ //
///////////////////////////
router.get("/storie/:id", requireUserLogin, async (req, res) => {
  try {
    const storie = await Storie.find({
      _id: req.params.id,
      expireToken: { $gt: Date.now() },
    }).populate("postedBy", "_id firstName lastName email birthDay username");

    if (!storie) {
      res.status(500).json({ success: false });
    }

    res.send({ storie });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* GET all Post */    //
///////////////////////////
router.get("/allposts", requireUserLogin, async (req, res) => {
  try {
    const post = await Post.find()
      .populate("postedBy", "_id firstName lastName  image")
      .sort("-createdAt");

    if (!post) {
      return res.status(400).json({ success: false, error: "can't get data" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

module.exports = router;
