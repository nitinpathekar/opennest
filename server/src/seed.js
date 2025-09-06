import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Community from "./models/Community.js";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/opennest";

async function run() {
  await mongoose.connect(MONGO_URI);
  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Community.deleteMany({})]);
  const pw = await bcrypt.hash("password", 10);
  const alice = await User.create({ username: "alice", email: "alice@example.com", password: pw });
  const bob = await User.create({ username: "bob", email: "bob@example.com", password: pw });
  const web = await Community.create({ name: "Web Dev", description: "All about web development", moderators: [alice._id], members: [alice._id, bob._id] });
  await Post.create({ author: alice._id, community: web._id, title: "Welcome to OpenNest!", content: "This is the first post 🎉" });
  await mongoose.disconnect();
  console.log("Seeded 🚀");
}
run().catch(e => { console.error(e); process.exit(1); });
