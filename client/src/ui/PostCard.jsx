import { Link } from "react-router-dom";
import Vote from "./Vote.jsx";

export default function PostCard({ post, onVoted }) {
  return (
    <div className="bg-white border rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        {post.community ? (
          <Link to={`/community/${post.community.slug}`} className="font-medium text-zinc-700">{post.community.name}</Link>
        ) : <span className="font-medium text-zinc-700">General</span>}
        <span>•</span>
        <Link to={`/u/${post.author.username}`}>u/{post.author.username}</Link>
        <span>•</span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <Link to={`/post/${post._id}`} className="block mt-2">
        <h3 className="font-semibold text-lg">{post.title}</h3>
        {post.content && <p className="text-zinc-700 mt-1 line-clamp-3">{post.content}</p>}
      </Link>
      <div className="mt-3">
        <Vote targetType="post" targetId={post._id} score={post.score || 0} onVoted={onVoted} />
      </div>
    </div>
  );
}
