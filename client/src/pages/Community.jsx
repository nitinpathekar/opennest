import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import PostCard from "../ui/PostCard.jsx";

export default function Community() {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/api/communities/${slug}`).then(setData).catch(e => alert(e.message));
  }, [slug]);

  if (!data) return null;
  return (
    <div>
      <div className="bg-white border rounded-xl p-6 mb-4">
        <div className="text-2xl font-bold">{data.community.name}</div>
        <div className="text-sm text-zinc-600">{data.community.description}</div>
      </div>
      {data.posts.map(p => <PostCard key={p._id} post={p} />)}
    </div>
  );
}
