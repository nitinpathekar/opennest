import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import Vote from "../ui/Vote.jsx";
import Comment from "../ui/Comment.jsx";
import useAuth from "../store/auth.js";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    api(`/api/posts/${id}`).then(setPost);
    api(`/api/comments/post/${id}`).then(setComments);
  }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const c = await api("/api/comments", { method: "POST", token, body: { postId: id, content: text } });
    setText("");
    // reload comments
    const data = await api(`/api/comments/post/${id}`);
    setComments(data);
  }

  if (!post) return null;
  return (
    <div>
      <div className="bg-white border rounded-xl p-6">
        <div className="text-sm text-zinc-500">u/{post.author.username} • {new Date(post.createdAt).toLocaleString()}</div>
        <h1 className="text-2xl font-bold mt-2">{post.title}</h1>
        <p className="mt-2">{post.content}</p>
        <div className="mt-3">
          <Vote targetType="post" targetId={post._id} score={post.score || 0} onVoted={(s)=>setPost(p=>({ ...p, score: s }))} />
        </div>
      </div>

      <div className="mt-6 bg-white border rounded-xl p-6">
        <h2 className="font-semibold mb-3">Comments</h2>
        <form onSubmit={submitComment} className="mb-4">
          <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full border rounded p-2 h-24" placeholder="Write a comment..." />
          <button className="mt-2 bg-black text-white rounded px-4 py-2">Comment</button>
        </form>
        <div>
          {comments.map(node => <Comment key={node._id} node={node} onReply={() => {}} />)}
        </div>
      </div>
    </div>
  );
}
