import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import useAuth from "../store/auth.js";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { token } = useAuth();
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const p = await api("/api/posts", { method: "POST", token, body: { title, content } });
      nav(`/post/${p._id}`);
    } catch (e) { alert(e.message); }
  }

  return (
    <div className="bg-white border rounded-xl p-6">
      <h1 className="text-xl font-semibold mb-4">Create Post</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded p-2" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" className="w-full border rounded p-2 h-40" />
        <button className="bg-black text-white rounded px-4 py-2">Publish</button>
      </form>
    </div>
  );
}
