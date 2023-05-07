const express = require("express");
const resetPasswordRouter = express.Router();
require("dotenv").config();
const User = require("../models/users");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

resetPasswordRouter.post("/", async (req, res) => {
  const { resetLink, newPassword } = req.body;
  encryptedPassword = await bcrypt.hash(newPassword, 10);
  if (resetLink) {
    jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      async (err, decodedData) => {
        if (err) {
          return res
            .status(401)
            .json({ message: "Inccorect token or it is expired" });
        }
        await User.findOne({ resetLink })
          .then(async (user) => {
            const obj = {
              password: encryptedPassword,
            };
            user = _.extend(user, obj);
            user
              .save()
              .then(() =>
                res
                  .status(200)
                  .json({ message: "your password has been changed" })
              )
              .catch(() =>
                res.status(400).json({ message: "reset password error" })
              );
          })
          .catch(() =>
            res
              .status(400)
              .json({ message: "User with this token does not exists" })
          );
      }
    );
  } else {
    return res.status(401).json({ message: "Authentication Error" });
  }
});

module.exports = resetPasswordRouter;
