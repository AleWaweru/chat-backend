const express = require("express");
const router = express.Router();
const UserModel = require("../models/Users");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then(async (hash) => {
    try {
      await UserModel.create({
        username: username,
        password: hash,
      });
      res.json("SUCCESS");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ error: "User Does not exist" });
    }

    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.status(400).json({ error: "Wrong Password and Username Combination" });
      }

      const accessToken = sign(
        { username: user.username, id: user._id },
        "mysecret123"
      );
      res.json({ token: accessToken, username: user.username, id: user._id });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

router.get("/basicInfo/:id", async (req, res) => {
  const id = req.params._id; // Use req.params.id to get userId
  try {
    const basicInfo = await UserModel.findById(id, { password: 0 });
    res.json(basicInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/changepassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await UserModel.findOne({ username: req.user.username });
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
      if (!match) res.status(400).json({ error: "Wrong Password Entered" });

      const hash = await bcrypt.hash(newPassword, 10);
      await UserModel.updateOne({ username: req.user.username }, { password: hash });
      res.json("SUCCESS");
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
