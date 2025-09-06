import express from "express";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:username", async (req, res, next) => {
  try {
    const u = await User.findOne({ username: req.params.username }).select("-password").populate("followers following", "username avatarUrl");
    if (!u) return res.status(404).json({ error: "User not found" });
    res.json(u);
  } catch (e) { next(e); }
});

router.put("/me", auth, async (req, res, next) => {
  try {
    const { bio, avatarUrl } = req.body;
    if (bio !== undefined) req.user.bio = bio;
    if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl;
    await req.user.save();
    res.json({ ok: true, bio: req.user.bio, avatarUrl: req.user.avatarUrl });
  } catch (e) { next(e); }
});

router.post("/:id/follow", auth, async (req, res, next) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ error: "User not found" });
    const me = req.user;
    const isFollowing = me.following.some(x => x.toString() === target._id.toString());
    if (isFollowing) {
      me.following = me.following.filter(x => x.toString() !== target._id.toString());
      target.followers = target.followers.filter(x => x.toString() !== me._id.toString());
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
    }
    await me.save();
    await target.save();
    res.json({ following: !isFollowing });
  } catch (e) { next(e); }
});

export default router;
