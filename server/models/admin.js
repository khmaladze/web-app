const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      maxlength: 90,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 16,
      maxlength: 100,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin };
