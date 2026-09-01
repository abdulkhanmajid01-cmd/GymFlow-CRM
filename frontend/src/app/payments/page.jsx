"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Loader2,
  Banknote,
  WalletCards,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllMembers } from "@/services/memberService";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "@/services/paymentService";

export default function PaymentsPage() {
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [editingPayment, setEditingPayment] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    memberId: "",
    membershipId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    transactionId: "",
    notes: "",
  });

  // ========================================
  // Load Data
  // ========================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [membersResponse, paymentsResponse] =
        await Promise.all([
          getAllMembers(),
          getPayments(),
        ]);

      setMembers(membersResponse?.data || []);
      setPayments(paymentsResponse?.data || []);
    } catch (err) {
      console.error("Payments Load Error:", err);

      setError(
        err.message || "Failed to load payment data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ========================================
  // Form Helpers
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      memberId: "",
      membershipId: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Cash",
      transactionId: "",
      notes: "",
    });

    setEditingPayment(null);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ========================================
  // Edit Payment (record installment)
  // ========================================

  const openEditModal = (payment) => {
    setEditingPayment(payment);

    setFormData({
      memberId: payment.memberId?._id || payment.memberId || "",
      membershipId:
        payment.membershipId?._id ||
        payment.membershipId ||
        "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod:
        payment.paymentMethod || "Cash",
      transactionId: "",
      notes: "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // ========================================
  // Submit Payment
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.amount) {
      setError(
        editingPayment
          ? "Installment amount is required."
          : "Payment amount is required."
      );

      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Payment amount must be greater than 0.");

      return;
    }

    if (
      !editingPayment &&
      (!formData.memberId ||
        !formData.membershipId ||
        !formData.paymentMethod)
    ) {
      setError(
        "Member, membership plan and payment method are required."
      );

      return;
    }

    if (
      !editingPayment &&
      formData.paymentMethod !== "Cash" &&
      !formData.transactionId.trim()
    ) {
      setError(
        "Transaction ID is required for non-cash payments."
      );

      return;
    }

    try {
      setSaving(true);

      if (editingPayment) {
        const response = await updatePayment(
          editingPayment._id,
          { amount: Number(formData.amount) }
        );

        setPayments((previous) =>
          previous.map((payment) =>
            payment._id === editingPayment._id
              ? response.data
              : payment
          )
        );

        setSuccess("Installment recorded successfully.");
      } else {
        const payload = {
          memberId: formData.memberId,
          membershipId: formData.membershipId,
          amount: Number(formData.amount),
          paymentDate: formData.paymentDate,
          paymentMethod: formData.paymentMethod,
          transactionId:
            formData.paymentMethod === "Cash"
              ? null
              : formData.transactionId.trim(),
          notes: formData.notes.trim(),
        };

        const response = await createPayment(payload);

        setPayments((previous) => [
          response.data,
          ...previous,
        ]);

        setSuccess("Payment recorded successfully.");
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // Delete Payment
  // ========================================

  const confirmDeletePayment = (paymentId) => {
    setConfirmDeleteId(paymentId);
    setError("");
    setSuccess("");
  };

  const cancelDeletePayment = () => {
    setConfirmDeleteId(null);
  };

  const handleDelete = async () => {
    const paymentId = confirmDeleteId;

    if (!paymentId) {
      return;
    }

    try {
      setDeletingId(paymentId);
      setError("");
      setSuccess("");

      await deletePayment(paymentId);

      setPayments((previous) =>
        previous.filter(
          (payment) => payment._id !== paymentId
        )
      );

      setSuccess("Payment deleted successfully.");
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Payment Delete Error:", err);

      setError(
        err.message || "Failed to delete payment."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // Selected Member
  // ========================================

  const selectedMember = useMemo(() => {
    return members.find(
      (member) => member._id === formData.memberId
    );
  }, [members, formData.memberId]);

  const availablePlans = useMemo(() => {
    if (!selectedMember) {
      return [];
    }

    if (!selectedMember.membershipPlan) {
      return [];
    }

    if (typeof selectedMember.membershipPlan === "object") {
      return [selectedMember.membershipPlan];
    }

    return [];
  }, [selectedMember]);

  // ========================================
  // Search
  // ========================================

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return payments;
    }

    return payments.filter((payment) => {
      const memberName =
        payment.memberId?.fullName?.toLowerCase() || "";

      const memberEmail =
        payment.memberId?.email?.toLowerCase() || "";

      const method =
        payment.paymentMethod?.toLowerCase() || "";

      const transactionId =
        payment.transactionId?.toLowerCase() || "";

      return (
        memberName.includes(query) ||
        memberEmail.includes(query) ||
        method.includes(query) ||
        transactionId.includes(query)
      );
    });
  }, [payments, search]);

  // ========================================
  // Statistics
  // ========================================

  const totalRevenue = useMemo(() => {
    return payments.reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );
  }, [payments]);

  // ========================================
  // Format Currency
  // ========================================

  const formatCurrency = (amount) => {
    return `PKR ${Number(amount || 0).toLocaleString()}`;
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  // ========================================
  // Render
  // ========================================

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Payments
            </h1>

            <p className="text-slate-500 mt-1">
              Manage gym payments and payment history.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Record Payment
          </button>

        </div>

        {/* Alerts */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Revenue
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(totalRevenue)}
                </h3>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Banknote size={21} />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Payments
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {payments.length}
                </h3>
              </div>

              <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <CreditCard size={21} />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Paid Records
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {
                    payments.filter(
                      (payment) =>
                        payment.status === "Paid"
                    ).length
                  }
                </h3>
              </div>

              <div className="w-11 h-11 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <WalletCards size={21} />
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Partial / Pending
                </p>

                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {
                    payments.filter(
                      (payment) =>
                        payment.status !== "Paid"
                    ).length
                  }
                </h3>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <CreditCard size={21} />
              </div>

            </div>
          </div>

        </div>

        {/* Search */}

        <div className="bg-white rounded-2xl border border-slate-200 p-4">

          <div className="relative max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search member, email, method..."
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* Payments Table */}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100">

            <h2 className="font-semibold text-slate-900">
              Payment History
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              View and manage recorded payments.
            </p>

          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2
                size={24}
                className="animate-spin mr-2"
              />
              Loading payments...
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-16 px-6">

              <CreditCard
                size={40}
                className="mx-auto text-slate-300"
              />

              <h3 className="font-semibold text-slate-700 mt-4">
                {payments.length === 0
                  ? "No payments recorded"
                  : "No payments match your search"}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {payments.length === 0
                  ? "Record your first payment to get started."
                  : "Try a different search term."}
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-slate-50">

                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Member
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Plan
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Amount
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Method
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Received By
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredPayments.map((payment) => {

                    const status = payment.status || "Pending";

                    return (
                      <tr
                        key={payment._id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-6 py-4">

                          <div className="font-medium text-slate-900">
                            {payment.memberId?.fullName ||
                              "Unknown Member"}
                          </div>

                          <div className="text-xs text-slate-500">
                            {payment.memberId?.email || ""}
                          </div>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-700">
                          {payment.membershipId?.planName ||
                            "Unknown Plan"}
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {formatCurrency(
                            payment.amount
                          )}
                        </td>

                        <td className="px-6 py-4">

                          <span className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                            {payment.paymentMethod}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {payment.paymentDate
                            ? new Date(
                                payment.paymentDate
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              status === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : status === "Partial"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {status}
                          </span>

                        </td>

                        <td className="px-6 py-4">
                          {payment.collections &&
                          payment.collections.length > 0 ? (
                            <div className="space-y-1.5">
                              {payment.collections.map(
                                (collection, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2 flex-wrap"
                                  >
                                    <span className="font-medium text-slate-900">
                                      {collection.receivedBy
                                        ?.fullName ||
                                        "Unknown"}
                                    </span>

                                    <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium capitalize">
                                      {collection.receivedBy
                                        ?.role || "Staff"}
                                    </span>

                                    <span className="text-xs text-slate-500">
                                      ({formatAmount(
                                        collection.amount
                                      )})
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">
                              -
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              onClick={() =>
                                openEditModal(payment)
                              }
                              className="w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center"
                              title="Record installment"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                confirmDeletePayment(
                                  payment._id
                                )
                              }
                              disabled={
                                deletingId ===
                                payment._id
                              }
                              className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center disabled:opacity-40"
                              title="Delete payment"
                            >
                              {deletingId ===
                              payment._id ? (
                                <Loader2
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* Payment Modal */}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {editingPayment
                      ? "Record Installment"
                      : "Record Payment"}
                  </h2>

                  {editingPayment ? (
                    <p className="text-sm text-slate-500 mt-1">
                      Add an installment toward this payment.
                      Current total:{" "}
                      {formatCurrency(
                        editingPayment.amount
                      )}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 mt-1">
                      Enter the payment details below.
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  disabled={saving}
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <X size={19} />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                {/* Modal Error Alert */}

                {error && (
                  <div className="text-red-500 bg-red-50 p-2 rounded mb-4">
                    {error}
                  </div>
                )}

                {/* Member */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Member *
                  </label>

                  <select
                    name="memberId"
                    value={formData.memberId}
                    onChange={(e) => {
                      handleChange(e);

                      setFormData((previous) => ({
                        ...previous,
                        membershipId: "",
                      }));
                    }}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                    disabled={!!editingPayment}
                  >
                    <option value="">
                      Select member
                    </option>

                    {members.map((member) => (
                      <option
                        key={member._id}
                        value={member._id}
                      >
                        {member.fullName}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Membership Plan */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Membership Plan *
                  </label>

                  <select
                    name="membershipId"
                    value={formData.membershipId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                    disabled={
                      !!editingPayment ||
                      !formData.memberId
                    }
                  >
                    <option value="">
                      {formData.memberId
                        ? "Select membership plan"
                        : "Select member first"}
                    </option>

                    {availablePlans.map((plan) => (
                      <option
                        key={plan._id}
                        value={plan._id}
                      >
                        {plan.planName} —{" "}
                        {formatCurrency(plan.price)}
                      </option>
                    ))}
                  </select>

                </div>

                {/* Amount */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {editingPayment
                      ? "Installment Amount *"
                      : "Amount *"}
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    placeholder="Enter payment amount"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />

                </div>

                {/* Date + Method (create only) */}

                {!editingPayment && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                      <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Payment Date *
                        </label>

                        <input
                          type="date"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Payment Method *
                        </label>

                        <select
                          name="paymentMethod"
                          value={formData.paymentMethod}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        >
                          <option value="Cash">
                            Cash
                          </option>

                          <option value="Bank Transfer">
                            Bank Transfer
                          </option>

                          <option value="JazzCash">
                            JazzCash
                          </option>

                          <option value="Easypaisa">
                            Easypaisa
                          </option>
                        </select>

                      </div>

                    </div>

                    {/* Transaction ID */}

                    {formData.paymentMethod !== "Cash" && (
                      <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Transaction ID *
                        </label>

                        <input
                          type="text"
                          name="transactionId"
                          value={formData.transactionId}
                          onChange={handleChange}
                          placeholder="Enter transaction/reference ID"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          required
                        />

                      </div>
                    )}

                    {/* Notes */}

                    <div>

                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Notes
                      </label>

                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Optional payment notes"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>
                  </>
                )}

                {/* Actions */}

                <div className="flex justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    disabled={saving}
                    className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={18}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        {editingPayment
                          ? "Record Installment"
                          : "Record Payment"}
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

        {/* Delete Confirmation Modal */}

        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">

              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                <h2 className="text-xl font-semibold text-slate-900">
                  Confirm Delete
                </h2>

                <button
                  onClick={cancelDeletePayment}
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X size={19} />
                </button>

              </div>

              <div className="p-6">

                <p className="text-sm text-slate-600">
                  Are you sure you want to delete this payment record?
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-6">

                  <button
                    type="button"
                    onClick={cancelDeletePayment}
                    disabled={deletingId === confirmDeleteId}
                    className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deletingId === confirmDeleteId}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingId === confirmDeleteId ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Delete
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
