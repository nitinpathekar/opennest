import Vote from "./Vote.jsx";

export default function Comment({ node, depth=0, onReply }) {
  return (
    <div className="mt-3" style={{ marginLeft: depth * 16 }}>
      <div className="bg-white border rounded-xl p-3">
        <div className="text-sm text-zinc-600">u/{node.author.username} • {new Date(node.createdAt).toLocaleString()}</div>
        <div className="mt-1">{node.content}</div>
        <div className="mt-2 flex items-center gap-3">
          <Vote targetType="comment" targetId={node._id} score={node.score || 0} />
          <button className="text-sm" onClick={() => onReply(node)}>Reply</button>
        </div>
      </div>
      {node.children?.map(child => (
        <Comment key={child._id} node={child} depth={depth+1} onReply={onReply} />
      ))}
    </div>
  );
}
