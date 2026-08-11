import apiRequest from "./api";

// ==========================
// Get All Staff
// ==========================
export const getAllStaff = async () => {
  return await apiRequest("/staff");
};

// ==========================
// Create Staff
// ==========================
export const createStaff = async (staffData) => {
  return await apiRequest("/staff", {
    method: "POST",
    body: JSON.stringify(staffData),
  });
};

// ==========================
// Update Staff
// ==========================
export const updateStaff = async (id, staffData) => {
  return await apiRequest(`/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(staffData),
  });
};

// ==========================
// Delete Staff
// ==========================
export const deleteStaff = async (id) => {
  return await apiRequest(`/staff/${id}`, {
    method: "DELETE",
  });
};