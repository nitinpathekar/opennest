import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import makeToken from "../utils/makeToken.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: "Username or email already in use" });
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ username, email, password: hash });
    const token = makeToken(u);
    res.json({ token, user: { id: u._id, username: u.username, email: u.email, avatarUrl: u.avatarUrl, bio: u.bio } });
  } catch (e) { next(e); }
});

router.post("/login", async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) return res.status(400).json({ error: "Missing fields" });
    const u = await User.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] });
    if (!u) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, u.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = makeToken(u);
    res.json({ token, user: { id: u._id, username: u.username, email: u.email, avatarUrl: u.avatarUrl, bio: u.bio } });
  } catch (e) { next(e); }
});

router.get("/me", auth, async (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, username: u.username, email: u.email, avatarUrl: u.avatarUrl, bio: u.bio, followers: u.followers.length, following: u.following.length } });
});

export default router;
