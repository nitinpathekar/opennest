import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import useAuth from "../store/auth.js";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);
      const p = await api("/api/posts", {
        method: "POST",
        token,
        body: { title, content },
      });
      nav(`/post/${p._id}`);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border rounded-xl p-6 max-w-xl mx-auto shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded">
            {error}
          </div>
        )}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content..."
          className="w-full border rounded-lg p-2 h-40 focus:outline-none focus:ring-2 focus:ring-black resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white 
            ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
        >
          {loading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Publish"
          )}
        </button>
      </form>
    </div>
  );
}
