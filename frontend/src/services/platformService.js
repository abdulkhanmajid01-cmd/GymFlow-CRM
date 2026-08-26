// ==========================
// Platform Administration Service
// ==========================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

// ==========================
// Get Platform Statistics
// ==========================

export const getPlatformStats = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "Authentication token not found. Please login again."
    );
  }

  const response = await fetch(
    `${API_URL}/platform/stats`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      cache: "no-store",
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  let result;

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch platform statistics."
    );
  }

  return result;
};