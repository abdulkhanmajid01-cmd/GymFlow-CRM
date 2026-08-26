"use client";

// React Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

// Authentication Service
import { loginUser } from "../../services/authService";

// Global Authentication Context
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  // Global User State
  const { setUser } = useAuth();

  // Next.js Router
  const router = useRouter();

  // Login Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Login UI State
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login Function
  const handleLogin = async (e) => {
    // Prevent Page Refresh
    e.preventDefault();

    // Clear previous errors
    setError("");
    setLoading(true);

    try {
      // Send Login Request To Backend
      const response = await loginUser(
        email,
        password
      );

      // ==========================
      // Save JWT Token
      // ==========================

      localStorage.setItem(
        "token",
        response.token
      );

      // ==========================
      // Save Logged In User
      // ==========================

      setUser(response.data);

      // ==========================
      // Role-Based Redirect
      // ==========================

      const role =
        response.data?.role
          ?.trim()
          ?.toLowerCase();

      // ==========================
      // Super Admin
      // ==========================

      if (role === "superadmin") {
        router.push("/super-admin");
        return;
      }

      // ==========================
      // Gym Admin
      // ==========================

      if (role === "admin") {
        router.push("/dashboard");
        return;
      }

      // ==========================
      // Receptionist
      // ==========================

      if (role === "receptionist") {
        router.push("/dashboard");
        return;
      }

      // ==========================
      // Trainer
      // ==========================

      if (role === "trainer") {
        router.push("/dashboard");
        return;
      }

      // ==========================
      // Invalid Role
      // ==========================

      // Remove authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);

      setError("Invalid user role. Please try again.");
    } catch (err) {
      setError(
        err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-center mb-6">
          GymFlow CRM
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Error Banner */}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-4 py-3"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {/* Password */}

          <div>
            <label className="block mb-2 text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-lg px-4 py-3"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />
          </div>

          {/* Login Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </main>
  );
}