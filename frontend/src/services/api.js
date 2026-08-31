const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

// ==========================
// Common API Request
// ==========================

export default async function apiRequest(
  endpoint,
  options = {}
) {
  try {
    // ==========================
    // JWT Token
    // ==========================

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    // ==========================
    // Headers
    // ==========================

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // ==========================
    // Authorization Header
    // ==========================

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // ==========================
    // API Request
    // ==========================

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    // ==========================
    // Read Response
    // ==========================

    const contentType =
      response.headers.get("content-type") || "";

    const isJson =
      contentType.includes("application/json");

    // Non-JSON bodies (for example HTML 500/502/504
    // proxy or server error pages) are read as text
    // instead of being parsed as JSON. This prevents
    // unhandled SyntaxError: "Unexpected token < in
    // JSON at position 0" crashes on the client.
    const data = isJson
      ? await response.json()
      : await response.text();

    // ==========================
    // Handle API Errors
    // ==========================

    if (!response.ok) {
      let message = isJson
        ? data?.message ||
          "Something went wrong. Please try again."
        : data?.trim() ||
          response.statusText ||
          "Something went wrong. Please try again.";

      // ==========================
      // Duplicate MongoDB Error
      // Frontend Safety Fallback
      // ==========================

      if (
        message.includes("E11000") ||
        message.includes("duplicate key")
      ) {
        const fieldMatch =
          message.match(
            /index:\s*([a-zA-Z0-9_]+)_1/
          );

        const field =
          fieldMatch?.[1];

        const fieldMessages = {
          memberId: "Member ID",
          email: "Email address",
          phoneNumber: "Phone number",
          cnic: "CNIC",
        };

        const fieldName =
          fieldMessages[field] ||
          "This value";

        message = `${fieldName} already exists. Please use a different ${fieldName}.`;
      }

      throw new Error(message);
    }

    // ==========================
    // Success Response
    // ==========================

    return data;
  } catch (error) {
    // ==========================
    // Network Error
    // ==========================

    if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      throw new Error(
        "Unable to connect to the server. Please try again."
      );
    }

    // ==========================
    // Re-throw Clean Error
    // ==========================

    throw error;
  }
}