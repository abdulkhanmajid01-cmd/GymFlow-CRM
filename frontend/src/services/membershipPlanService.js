// API Helper
import apiRequest from "./api";

// ==========================
// Get All Membership Plans
// ==========================
export const getAllMembershipPlans = async () => {

  return await apiRequest(
    "/membership-plans"
  );

};

// ==========================
// Get Single Membership Plan
// ==========================
export const getMembershipPlanById = async (
  id
) => {

  return await apiRequest(
    `/membership-plans/${id}`
  );

};

// ==========================
// Create Membership Plan
// ==========================
export const createMembershipPlan = async (
  planData
) => {

  return await apiRequest(
    "/membership-plans",
    {
      method: "POST",
      body: JSON.stringify(planData),
    }
  );

};

// ==========================
// Update Membership Plan
// ==========================
export const updateMembershipPlan = async (
  id,
  planData
) => {

  return await apiRequest(
    `/membership-plans/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(planData),
    }
  );

};

// ==========================
// Delete Membership Plan
// ==========================
export const deleteMembershipPlan = async (
  id
) => {

  return await apiRequest(
    `/membership-plans/${id}`,
    {
      method: "DELETE",
    }
  );

};