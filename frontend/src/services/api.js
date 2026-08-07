const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ==========================
// Common API Request
// ==========================
export default async function apiRequest(
  endpoint,
  options = {}
) {

  // JWT Token
  const token = localStorage.getItem("token");

  // Headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Authorization Header
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // API Request
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;

}