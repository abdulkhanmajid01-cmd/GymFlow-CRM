"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================
  // Load User From LocalStorage
  // ==========================
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error(
        "Failed to load saved user:",
        error
      );

      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================
  // Save User
  // ==========================
  const handleSetUser = (userData) => {
    setUser(userData);

    if (userData) {
      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );
    } else {
      localStorage.removeItem("user");
    }
  };

  // ==========================
  // Logout
  // ==========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: handleSetUser,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}