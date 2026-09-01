import apiRequest from "./api";

// ========================================
// Get All Payments
// ========================================

export const getPayments = async () => {
  return apiRequest("/payments");
};

// ========================================
// Get Member Payment History
// ========================================

export const getMemberPayments = async (memberId) => {
  return apiRequest(`/payments/member/${memberId}`);
};

// ========================================
// Get Member Payment Summary
// ========================================

export const getMemberPaymentSummary = async (memberId) => {
  return apiRequest(
    `/payments/member/${memberId}/summary`
  );
};

// ========================================
// Create Payment
// ========================================

export const createPayment = async (paymentData) => {
  return apiRequest("/payments", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};

// ========================================
// Update Payment
// ========================================

export const updatePayment = async (
  paymentId,
  paymentData
) => {
  return apiRequest(`/payments/${paymentId}`, {
    method: "PUT",
    body: JSON.stringify(paymentData),
  });
};

// ========================================
// Delete Payment
// ========================================

export const deletePayment = async (paymentId) => {
  return apiRequest(`/payments/${paymentId}`, {
    method: "DELETE",
  });
};