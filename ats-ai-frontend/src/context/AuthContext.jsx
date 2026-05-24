// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // load from localStorage on first mount
  // load from localStorage on first mount
  useEffect(() => {
    const stored = localStorage.getItem("ats_auth");
    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        setToken(parsed.token);
        setUser(parsed.user);
        // optional: verify token
        api
          .get("/auth/me", {
            headers: { Authorization: `Bearer ${parsed.token}` },
          })
          .then((res) => {
            setUser(res.data.user);
          })
          .catch(() => {
            // token invalid, wipe it
            localStorage.removeItem("ats_auth");
            setToken(null);
            setUser(null);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } catch {
      localStorage.removeItem("ats_auth");
      setLoading(false);
    }
  }, []);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(
      "ats_auth",
      JSON.stringify({ token: newToken, user: newUser })
    );
  };

  const logout = () => {
    // Clear user-specific resume data before wiping user reference
    if (user?.id) {
      localStorage.removeItem(`resume_form_data_${user.id}`);
    }
    // Also clean up the old shared key (legacy)
    localStorage.removeItem("resume_form_data");
    setToken(null);
    setUser(null);
    localStorage.removeItem("ats_auth");
  };

  const value = { user, token, login, logout, loading, isAuthed: !!token };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
