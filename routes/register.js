const express = require("express");
const registrationRouter = express.Router();
require("dotenv").config();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register
registrationRouter.post("/", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!(email && password && first_name && last_name)) {
      res.status(400).json({ message: "All input is required"});
    }

    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(400).json({ message: "User Already Exist. Please Login"});
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
      }
    );

    const refreshToken = jwt.sign(
      { user_id: user._id, email },
      process.env.REFRESH_TOKEN_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME,
      }
    );

    user.token = token;
    user.refreshToken = refreshToken;

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = registrationRouter;
