import express from "express";
import Post from "../models/Post.js";
import Vote from "../models/Vote.js";
import Comment from "../models/Comment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// list feed (latest)
router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(50).populate("author", "username avatarUrl").populate("community", "name slug");
    // compute scores
    const ids = posts.map(p => p._id);
    const votes = await Vote.aggregate([
      { $match: { targetType: "post", targetId: { $in: ids } } },
      { $group: { _id: "$targetId", score: { $sum: "$value" } } }
    ]);
    const scoreMap = new Map(votes.map(v => [v._id.toString(), v.score]));
    res.json(posts.map(p => ({ ...p.toObject(), score: scoreMap.get(p._id.toString()) || 0 })));
  } catch (e) { next(e); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, content, communityId, images } = req.body;
    const post = await Post.create({ title, content, community: communityId || null, images: images || [], author: req.user._id });
    res.json(await post.populate("author", "username avatarUrl"));
  } catch (e) { next(e); }
});

router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username avatarUrl").populate("community", "name slug");
    if (!post) return res.status(404).json({ error: "Post not found" });
    const scoreDoc = await Vote.aggregate([
      { $match: { targetType: "post", targetId: post._id } },
      { $group: { _id: "$targetId", score: { $sum: "$value" } } }
    ]);
    const score = scoreDoc[0]?.score || 0;
    res.json({ ...post.toObject(), score });
  } catch (e) { next(e); }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const p = await Post.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Post not found" });
    if (p.author.toString() !== req.user._id.toString()) return res.status(403).json({ error: "Not your post" });
    await Comment.deleteMany({ post: p._id });
    await Vote.deleteMany({ targetType: "post", targetId: p._id });
    await p.deleteOne();
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
