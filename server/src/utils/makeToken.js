import jwt from "jsonwebtoken";
export default function makeToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || "dev", { expiresIn: "7d" });
}
