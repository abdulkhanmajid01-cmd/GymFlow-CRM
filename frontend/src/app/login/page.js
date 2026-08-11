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

  // Login Function
  const handleLogin = async (e) => {
    // Prevent Page Refresh
    e.preventDefault();

    try {
      // Send Login Request To Backend
      const response = await loginUser(email, password);

      // Check Backend Response
      console.log(response);

      // Save JWT Token In Browser
      localStorage.setItem("token", response.token);

      // Save Logged In User In Global Context
      setUser(response.data);

      console.log("✅ Login Successful");
      console.log("👤 User Role:", response.data?.role);

      // ==========================
      // Role-Based Redirect
      // ==========================

      const role = response.data?.role?.toLowerCase();

      if (role === "admin") {
        router.push("/dashboard");
      } else if (role === "receptionist") {
        router.push("/dashboard");
      } else if (role === "trainer") {
        router.push("/dashboard");
      } else {
        console.error("❌ Invalid user role:", role);

        // Remove token if role is invalid
        localStorage.removeItem("token");

        throw new Error("Invalid user role.");
      }
    } catch (error) {
      console.error("❌ Login Failed:", error);
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            Login
          </button>

        </form>

      </div>
    </main>
  );
}