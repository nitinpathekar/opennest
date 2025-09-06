import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import useAuth from "../store/auth.js";

export default function Login() {
  const [emailOrUsername, setEU] = useState("");
  const [password, setPw] = useState("");
  const nav = useNavigate();
  const { setAuth } = useAuth();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api("/api/auth/login", { method: "POST", body: { emailOrUsername, password } });
      setAuth(res.token, res.user);
      nav("/");
    } catch (e) { alert(e.message); }
  }
  return (
    <div className="bg-white border rounded-xl p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={emailOrUsername} onChange={e=>setEU(e.target.value)} placeholder="Email or Username" className="w-full border rounded p-2" />
        <input type="password" value={password} onChange={e=>setPw(e.target.value)} placeholder="Password" className="w-full border rounded p-2" />
        <button className="w-full bg-black text-white rounded p-2">Login</button>
      </form>
      <p className="text-sm mt-3">No account? <Link to="/register" className="underline">Register</Link></p>
    </div>
  );
}
