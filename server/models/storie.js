const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const storieSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    photo: {
      type: String,
    },
    expireToken: Date,
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    userCreatedAtLocalTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Storie = mongoose.model("Storie", storieSchema);

module.exports = { Storie };
