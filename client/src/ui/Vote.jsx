import useAuth from "../store/auth.js";
import { api } from "../lib/api.js";

export default function Vote({ targetType, targetId, score=0, onVoted }) {
  const { token } = useAuth();
  async function onVote(value) {
    try {
      const res = await api(`/api/votes`, { method: "POST", token, body: { targetType, targetId, value } });
      onVoted?.(res.score);
    } catch (e) {
      alert(e.message);
    }
  }
  return (
    <div className="inline-flex items-center gap-2">
      <button className="px-2 py-1 rounded border" onClick={() => onVote(1)}>▲</button>
      <span className="font-semibold">{score}</span>
      <button className="px-2 py-1 rounded border" onClick={() => onVote(-1)}>▼</button>
    </div>
  );
}
