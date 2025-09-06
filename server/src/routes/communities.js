import express from "express";
import Community from "../models/Community.js";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const c = await Community.create({ name, description, moderators: [req.user._id], members: [req.user._id] });
    res.json(c);
  } catch (e) { next(e); }
});

router.get("/", async (req, res, next) => {
  try {
    const list = await Community.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (e) { next(e); }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const c = await Community.findOne({ slug: req.params.slug });
    if (!c) return res.status(404).json({ error: "Not found" });
    const posts = await Post.find({ community: c._id }).sort({ createdAt: -1 }).populate("author", "username avatarUrl");
    res.json({ community: c, posts });
  } catch (e) { next(e); }
});

router.post("/:id/join", auth, async (req, res, next) => {
  try {
    const c = await Community.findById(req.params.id);
    if (!c) return res.status(404).json({ error: "Not found" });
    const isMember = c.members.some(m => m.toString() === req.user._id.toString());
    if (isMember) {
      c.members = c.members.filter(m => m.toString() != req.user._id.toString());
    } else {
      c.members.push(req.user._id);
    }
    await c.save();
    res.json({ member: !isMember });
  } catch (e) { next(e); }
});

export default router;
