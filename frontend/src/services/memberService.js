import apiRequest from "./api";

// Get All Members
export const getAllMembers = async () => {
  return await apiRequest("/members");
};

// Get Single Member
export const getMemberById = async (id) => {
  return await apiRequest(`/members/${id}`);
};

// Create Member
export const createMember = async (memberData) => {
  return await apiRequest("/members", {
    method: "POST",
    body: JSON.stringify(memberData),
  });
};

// Update Member
export const updateMember = async (id, memberData) => {
  return await apiRequest(`/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(memberData),
  });
};

// Delete Member
export const deleteMember = async (id) => {
  return await apiRequest(`/members/${id}`, {
    method: "DELETE",
  });
};