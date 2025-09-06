import express from "express";
import Comment from "../models/Comment.js";
import Vote from "../models/Vote.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/post/:postId", async (req, res, next) => {
  try {
    const list = await Comment.find({ post: req.params.postId }).sort({ createdAt: 1 }).populate("author", "username avatarUrl");
    // Build a tree
    const byId = new Map();
    const roots = [];
    list.forEach(c => byId.set(c._id.toString(), { ...c.toObject(), children: [], score: 0 }));
    // scores
    const ids = list.map(c => c._id);
    if (ids.length) {
      const votes = await Vote.aggregate([
        { $match: { targetType: "comment", targetId: { $in: ids } } },
        { $group: { _id: "$targetId", score: { $sum: "$value" } } }
      ]);
      votes.forEach(v => {
        const node = byId.get(v._id.toString());
        if (node) node.score = v.score;
      });
    }
    list.forEach(c => {
      const node = byId.get(c._id.toString());
      if (c.parentComment) {
        const parent = byId.get(c.parentComment.toString());
        parent?.children.push(node);
      } else roots.push(node);
    });
    res.json(roots);
  } catch (e) { next(e); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { postId, content, parentComment } = req.body;
    if (!postId || !content) return res.status(400).json({ error: "Missing fields" });
    const c = await Comment.create({ post: postId, content, parentComment: parentComment || null, author: req.user._id });
    const populated = await c.populate("author", "username avatarUrl");
    res.json(populated);
  } catch (e) { next(e); }
});

export default router;
