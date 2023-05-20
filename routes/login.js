const express = require("express");
const loginRouter = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

// Login
loginRouter.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
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
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = loginRouter;
