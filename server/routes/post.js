const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireUserLogin = require("../middleware/requireUserLogin");
const Post = mongoose.model("Post");
const asyncHandler = require("../middleware/middleware");

///////////////////////////
// /* Create post */     //
///////////////////////////
router.post("/post", requireUserLogin, async (req, res) => {
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

    // create post with only text
    if (text && !photo) {
      // check if text length is valid
      if (text.length >= 301) {
        return res.status(422).json({
          error: `Text  max length is 300. your text size is ${text.length} `,
        });
      }

      req.user.password = undefined;
      req.user.email = undefined;
      req.user.birthDay = undefined;
      req.user.isBlocked = undefined;
      req.user.createdAt = undefined;
      req.user.updatedAt = undefined;

      let post = new Post({
        text,
        userCreatedAtLocalTime,
        postedBy: req.user,
      });

      post = await post.save();

      if (!post) {
        return res.status(500).json({ error: "error" });
      }

      res.json({ post });
    }

    // create post with only text
    if (!text && photo) {
      req.user.password = undefined;
      req.user.email = undefined;
      req.user.birthDay = undefined;
      req.user.isBlocked = undefined;
      req.user.createdAt = undefined;
      req.user.updatedAt = undefined;

      let post = new Post({
        photo,
        userCreatedAtLocalTime,
        postedBy: req.user,
      });

      post = await post.save();

      if (!post) {
        return res.status(500).json({ error: "error" });
      }

      res.json({ post });
    }

    // create post with text and image
    if (text && photo) {
      // check if text length is valid
      if (text.length >= 501) {
        return res.status(422).json({
          error: `Text  max length is 500. your text size is ${text.length} `,
        });
      }

      req.user.password = undefined;
      req.user.email = undefined;
      req.user.birthDay = undefined;
      req.user.isBlocked = undefined;
      req.user.createdAt = undefined;
      req.user.updatedAt = undefined;

      let post = new Post({
        text,
        photo,
        userCreatedAtLocalTime,
        postedBy: req.user,
      });

      post = await post.save();

      if (!post) {
        return res.status(500).json({ error: "error" });
      }

      res.json({ post });
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

///////////////////////////
// /* Update post */     //
///////////////////////////
router.put(
  "/post/:id",
  requireUserLogin,
  asyncHandler(async (req, res, next) => {
    try {
      const { text, photo } = req.body;

      // check if text or photo is not empty
      if (!text && !photo) {
        return res.status(422).json({ error: "Please add all the fields" });
      }

      // check if text length is valid
      if (text.length >= 501) {
        return res.status(422).json({
          error: `Text  max length is 500. your text size is ${text.length} `,
        });
      }

      const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      res.status(500).json({ success: "false", error: error });
    }
  })
);

///////////////////////////
// /* Delete post */     //
///////////////////////////
router.delete("/post/:id", requireUserLogin, async (req, res) => {
  try {
    const postAuthor = await Post.find({ _id: req.params.id })
      .populate("postedBy", "_id")
      .select("-_id -photo -text ");

    if (!postAuthor) {
      return res.status(400).json({ success: false, error: "post not found" });
    }

    const currentUser = req.user._id;
    const postedBy = postAuthor[0].postedBy._id;

    if (currentUser.toString() == postedBy.toString()) {
      Post.findByIdAndRemove(req.params.id)
        .then((post) => {
          if (post) {
            return res
              .status(200)
              .json({ success: true, message: "post is deleted" });
          } else {
            return res.status(404).json({
              success: false,
              message: "nothing is deleted",
            });
          }
        })
        .catch((err) => {
          return res.status(400).json({ success: false, error: err });
        });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "you can't delete" });
    }
  } catch (error) {
    res.status(500).json({ success: "false", error: error });
  }
});

module.exports = router;
