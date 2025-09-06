import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api.js";
import useAuth from "../store/auth.js";

export default function Login() {
  const [emailOrUsername, setEU] = useState("");
  const [password, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { setAuth } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Email/Username and password are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await api("/api/auth/login", {
        method: "POST",
        body: { emailOrUsername, password },
      });
      setAuth(res.token, res.user);
      nav("/");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border rounded-xl p-6 max-w-md mx-auto shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="text-red-600 bg-red-100 border border-red-300 p-2 rounded">
            {error}
          </div>
        )}

        <input
          value={emailOrUsername}
          onChange={(e) => setEU(e.target.value)}
          placeholder="Email or Username"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
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
            "Login"
          )}
        </button>
      </form>

      <p className="text-sm mt-4 text-center">
        No account?{" "}
        <Link to="/register" className="underline text-black hover:text-gray-700">
          Register
        </Link>
      </p>
    </div>
  );
}
