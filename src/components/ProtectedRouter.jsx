// src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

export const fakeAuth = {
  user: null,

  login(user) {
    this.user = user;
    localStorage.setItem("medtrack_user", JSON.stringify(user));
  },

  logout() {
    this.user = null;
    localStorage.removeItem("medtrack_user");
  },

  getUser() {
    const saved = localStorage.getItem("medtrack_user");
    return saved ? JSON.parse(saved) : null;
  },
};

export default function ProtectedRoute({ children }) {
  const user = fakeAuth.getUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
