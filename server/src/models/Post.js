import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  title: { type: String, required: true },
  content: { type: String, default: "" },
  images: [{ type: String }],
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
