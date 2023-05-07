const express = require("express");
const refreshTokenRouter = express.Router();
require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyRefresh(email, token) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    return decoded.email === email;
  } catch (error) {
    return false;
  }
}
refreshTokenRouter.post("/", (req, res) => {
  const { email, refreshToken } = req.body;
  const isValid = verifyRefresh(email, refreshToken);
  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }
  const token = jwt.sign({ email: email }, process.env.TOKEN_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME,
  });
  return res.status(200).json({ token });
});

module.exports = refreshTokenRouter;
