const express = require("express");
const homePageRouter = express.Router();

const auth = require("../middleware/auth");
homePageRouter.post("/", auth, (req, res) => {
  res.status(200).json("Welcome 🙌 ");
});

module.exports = homePageRouter;
