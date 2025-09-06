import { useEffect, useState } from "react";
import { api } from "../lib/api.js";
import PostCard from "../ui/PostCard.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    api("/api/posts").then(setPosts).catch(e => alert(e.message));
  }, []);
  return (
    <div>
      {posts.map(p => (
        <PostCard key={p._id} post={p} onVoted={(score) => {
          setPosts(prev => prev.map(x => x._id === p._id ? { ...x, score } : x));
        }} />
      ))}
    </div>
  );
}
