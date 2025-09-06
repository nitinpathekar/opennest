import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api.js";
import useAuth from "../store/auth.js";

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    api(`/api/users/${username}`).then(setProfile).catch(e => alert(e.message));
  }, [username]);

  async function toggleFollow() {
    try {
      const res = await api(`/api/users/${profile._id}/follow`, { method: "POST", token });
      const meFollows = res.following;
      setProfile(prev => ({
        ...prev,
        followers: meFollows ? [...prev.followers, { _id: user.id, username: user.username }] : prev.followers.filter(f => f._id !== user.id)
      }));
    } catch (e) { alert(e.message); }
  }

  if (!profile) return null;
  const amMe = user?.username === profile.username;
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-center gap-4">
        <img src={profile.avatarUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${profile.username}`} alt="" className="w-20 h-20 rounded-full border" />
        <div>
          <div className="text-xl font-bold">{profile.username}</div>
          <div className="text-sm text-zinc-600">{profile.bio || "No bio yet."}</div>
          <div className="text-sm text-zinc-600 mt-1">{profile.followers?.length || 0} followers • {profile.following?.length || 0} following</div>
        </div>
        <div className="ml-auto">
          {amMe ? null : <button onClick={toggleFollow} className="px-3 py-1 rounded border">Follow / Unfollow</button>}
        </div>
      </div>
    </div>
  );
}
