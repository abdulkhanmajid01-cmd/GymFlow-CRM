// API Helper
import apiRequest from "./api";

// ==========================
// Login User
// ==========================
export const loginUser = async (
  email,
  password
) => {

  return await apiRequest(
    "/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

};