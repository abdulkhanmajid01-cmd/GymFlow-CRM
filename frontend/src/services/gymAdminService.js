const API_URL = "http://localhost:5000/api";

// Get authentication token
const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

// Common headers
const getHeaders = () => {
  const token = getToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ==========================================
// Get All Gym Administrators
// GET /api/gym-admins
// ==========================================

export const getAllGymAdmins = async () => {
  const response = await fetch(
    `${API_URL}/gym-admins`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  let result;

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    const text = await response.text();

    console.error(
      "Invalid response from gym-admins API:",
      text
    );

    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch gym administrators."
    );
  }

  return result;
};

// ==========================================
// Toggle Gym Administrator Status
// PATCH /api/gym-admins/:id/status
// ==========================================

export const toggleGymAdminStatus = async (
  adminId
) => {
  if (!adminId) {
    throw new Error(
      "Gym administrator ID is required."
    );
  }

  const response = await fetch(
    `${API_URL}/gym-admins/${adminId}/status`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  let result;

  if (contentType.includes("application/json")) {
    result = await response.json();
  } else {
    const text = await response.text();

    console.error(
      "Invalid response from gym-admin status API:",
      text
    );

    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update administrator status."
    );
  }

  return result;
};