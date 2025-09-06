import { create } from "zustand";

const useAuth = create((set) => ({
  token: localStorage.getItem("opennest_token") || "",
  user: JSON.parse(localStorage.getItem("opennest_user") || "null"),
  setAuth: (token, user) => {
    localStorage.setItem("opennest_token", token || "");
    localStorage.setItem("opennest_user", JSON.stringify(user || null));
    set({ token: token || "", user: user || null });
  },
  logout: () => {
    localStorage.removeItem("opennest_token");
    localStorage.removeItem("opennest_user");
    set({ token: "", user: null });
  }
}));

export default useAuth;
