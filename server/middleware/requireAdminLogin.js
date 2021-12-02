const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = mongoose.model("Admin");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const jwt_secret = process.env.ADMIN_SECRET;

  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, jwt_secret, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { _id } = payload;
    Admin.findById(_id).then((admin) => {
      req.admin = admin;
      next();
    });
  });
};
