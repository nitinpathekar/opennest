import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import useAuth from "../store/auth.js";

export default function Register() {
  const [username, setU] = useState("");
  const [email, setE] = useState("");
  const [password, setPw] = useState("");
  const nav = useNavigate();
  const { setAuth } = useAuth();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api("/api/auth/register", { method: "POST", body: { username, email, password } });
      setAuth(res.token, res.user);
      nav("/");
    } catch (e) { alert(e.message); }
  }
  return (
    <div className="bg-white border rounded-xl p-6">
      <h1 className="text-xl font-semibold mb-4">Create your account</h1>
      <form onSubmit={submit} className="space-y-3">
        <input value={username} onChange={e=>setU(e.target.value)} placeholder="Username" className="w-full border rounded p-2" />
        <input value={email} onChange={e=>setE(e.target.value)} placeholder="Email" className="w-full border rounded p-2" />
        <input type="password" value={password} onChange={e=>setPw(e.target.value)} placeholder="Password" className="w-full border rounded p-2" />
        <button className="w-full bg-black text-white rounded p-2">Register</button>
      </form>
      <p className="text-sm mt-3">Have an account? <Link to="/login" className="underline">Login</Link></p>
    </div>
  );
}
