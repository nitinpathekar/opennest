import express from "express";
import Vote from "../models/Vote.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const { targetType, targetId, value } = req.body;
    if (!["post","comment"].includes(targetType)) return res.status(400).json({ error: "Invalid type" });
    if (![1,-1].includes(value)) return res.status(400).json({ error: "Invalid value" });
    const existing = await Vote.findOne({ user: req.user._id, targetType, targetId });
    if (!existing) {
      await Vote.create({ user: req.user._id, targetType, targetId, value });
    } else if (existing.value === value) {
      await existing.deleteOne(); // toggle off
    } else {
      existing.value = value;
      await existing.save();
    }
    // return new score
    const agg = await Vote.aggregate([
      { $match: { targetType, targetId: typeof targetId === "string" ? new (await import("mongoose")).default.Types.ObjectId(targetId) : targetId } },
      { $group: { _id: "$targetId", score: { $sum: "$value" } } }
    ]);
    res.json({ score: agg[0]?.score || 0 });
  } catch (e) { next(e); }
});

export default router;
