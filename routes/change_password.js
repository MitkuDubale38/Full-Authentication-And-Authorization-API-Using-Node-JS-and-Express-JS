const express = require("express");
const changePasswordRouter = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const auth = require("../middleware/auth");
changePasswordRouter.patch("/:user_id", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.params.user_id });
  if (user) {
    encryptedPassword = await bcrypt.hash(req.body.password, 10);
    await User.findOneAndUpdate(
      {
        _id: req.params.user_id,
      },
      { $set: { password: encryptedPassword } }
    )
      .then(() => {
        const message = {
          message: "Password Successfully updated",
        };
        const token = jwt.sign(
          { user_id: user._id, email: user.email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;
        return res.status(200).json({ message, user: user });
      })
      .catch((err) => res.status(500).json({ message: err }));
  } else {
    return res
      .status(404)
      .json({ message: "User not found with the given ID" });
  }
});

module.exports = changePasswordRouter;
