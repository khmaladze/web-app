const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 20,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 30,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 90,
      lowercase: true,
      trim: true,
    },
    birthDay: {
      type: String,
      required: true,
      length: 10,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      maxlength: 50,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 16,
      maxlength: 100,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dtlhyd02w/image/upload/v1637955448/image_jqfozo.jpg",
    },
    backgroundImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dtlhyd02w/image/upload/v1637958935/richard-horvath-cPccYbPrF-A-unsplash_xha0n7.jpg",
    },
    biography: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    isFeatured: {
      type: Boolean,
      lowercase: true,
      trim: true,
      default: false,
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
