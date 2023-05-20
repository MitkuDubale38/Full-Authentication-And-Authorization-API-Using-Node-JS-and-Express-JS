const express = require("express");
const forgotPasswordRouter = express.Router();
require("dotenv").config();
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "mitedubale3864@gmail.com", // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});
forgotPasswordRouter.post("/", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });
  if (user) {
    await User.findOne({
      email,
    })
      .then(async () => {
        const token = jwt.sign(
          { user_id: User._id, email: User.email },
          process.env.RESET_PASSWORD_KEY,
          {
            expiresIn: process.env.RESET_PASSWORD_EXPIRE_TIME,
          }
        );

        const data = {
          from: "noreply@authappexample.com",
          to: email,
          subject: "Password Reset Link",
          html: `<h2> Please Click on the given link to reset your password </h2>
          <p>${process.env.CLIENT_URL}/resetpassword/${token} </p>`,
        };

        return User.updateOne({ resetLink: token })
          .then(() => {
            transporter.sendMail(data, function (err, body) {
              if (err) {
                return res.json({ message: err.message });
              }
              return res.json({
                message: "Email has been sent, kindly follow the instructions",
              });
            });
          })
          .catch(() =>
            res.status(400).json({ message: "Reset password link error" })
          );
      })
      .catch((err) => res.status(400).json({ message: err.message }));
  } else {
    res
      .status(400)
      .json({ message: "User with provided email address is not found!!" });
  }
});

module.exports = forgotPasswordRouter;
