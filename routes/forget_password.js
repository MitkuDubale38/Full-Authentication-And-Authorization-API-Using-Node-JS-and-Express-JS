const express = require("express");
const forgotPasswordRouter = express.Router();
require("dotenv").config();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "mitkudubale3864@gmail.com", // generated ethereal user
    pass: "rkipfuzdigysfgny", // generated ethereal password
  },
});
forgotPasswordRouter.post("/", async (req, res) => {
  const { email } = req.body;
  await User.findOne({
    email,
  })
    .then(async () => {
      const token = jwt.sign(
        { user_id: User._id, email: User.email },
        process.env.RESET_PASSWORD_KEY,
        {
          expiresIn: "20m",
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
              message: "Email has been sent, kindly follow the instructions ",
            });
          });
        })
        .catch(() =>
          res.status(400).json({ message: "Reset password link error" })
        );
    })
    .catch((err) => res.status(400).json({ message: err.message }));
});

module.exports = forgotPasswordRouter;
