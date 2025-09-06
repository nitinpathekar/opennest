import { Outlet, Link, useNavigate } from "react-router-dom";
import useAuth from "../store/auth.js";

export default function Layout() {
  const { user, logout, token } = useAuth();
  const nav = useNavigate();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link to="/" className="font-bold text-xl">OpenNest</Link>
          <Link to="/" className="text-sm">Home</Link>
          <Link to="/create" className="text-sm">Create</Link>
          <div className="ml-auto flex items-center gap-3">
            {token ? (
              <>
                <Link to={`/u/${user?.username}`} className="text-sm">Profile</Link>
                <button onClick={() => { logout(); nav("/"); }} className="text-sm px-3 py-1 rounded-full border">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm px-3 py-1 rounded-full border">Login</Link>
                <Link to="/register" className="text-sm px-3 py-1 rounded-full border">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <Outlet />
        </div>
        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-white border rounded-xl p-4">
            <div className="font-semibold mb-2">Communities</div>
            <p className="text-sm text-zinc-600">Join communities to personalize your feed.</p>
          </div>
        </aside>
      </main>
      <footer className="py-8 text-center text-sm text-zinc-500">© {new Date().getFullYear()} OpenNest</footer>
    </div>
  );
}
