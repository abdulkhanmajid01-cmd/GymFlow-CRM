"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCw, Trash2, AlertTriangle } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import StaffTable from "../../components/staff/StaffTable";
import StaffForm from "../../components/staff/StaffForm";

import {
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../../services/staffService";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // ==========================
  // Delete Confirmation Modal
  // ==========================
  const [staffToDelete, setStaffToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // ==========================
  // Load Staff
  // ==========================
  const loadStaff = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllStaff();

      setStaff(response.data || []);
    } catch (error) {
      console.error("Failed to load staff:", error);

      setError(
        error?.message ||
          "Failed to load staff members."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Initial Load
  // ==========================
  useEffect(() => {
    loadStaff();
  }, []);

  // ==========================
  // Open Add Form
  // ==========================
  const handleAdd = () => {
    setSelectedStaff(null);
    setShowForm(true);
  };

  // ==========================
  // Open Edit Form
  // ==========================
  const handleEdit = (member) => {
    setSelectedStaff(member);
    setShowForm(true);
  };

  // ==========================
  // Close Form
  // ==========================
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedStaff(null);
  };

  // ==========================
  // Create / Update Staff
  // ==========================
  const handleSubmit = async (staffData) => {
    try {
      setSaving(true);
      setError("");

      if (selectedStaff) {
        await updateStaff(
          selectedStaff._id,
          staffData
        );
      } else {
        await createStaff(staffData);
      }

      // Close form immediately
      // for faster perceived response
      handleCloseForm();

      // Refresh staff list in background
      loadStaff();
    } catch (error) {
      console.error(
        "Failed to save staff:",
        error
      );

      throw error;
    } finally {
      setSaving(false);
    }
  };

  // ==========================
  // Open Delete Modal
  // ==========================
  const handleDelete = (member) => {
    setStaffToDelete(member);
  };

  // ==========================
  // Cancel Delete
  // ==========================
  const handleCancelDelete = () => {
    if (deleting) return;

    setStaffToDelete(null);
  };

  // ==========================
  // Confirm Delete
  // ==========================
  const handleConfirmDelete = async () => {
    if (!staffToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteStaff(
        staffToDelete._id
      );

      // Refresh staff list
      await loadStaff();

      // Close modal
      setStaffToDelete(null);
    } catch (error) {
      console.error(
        "Failed to delete staff:",
        error
      );

      setError(
        error?.message ||
          "Failed to delete staff member."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>

      {/* ==========================
          Page Header
      ========================== */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Staff Management
          </h1>

          <p className="text-slate-500 mt-2">
            Manage receptionists and trainers.
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* Refresh */}

          <button
            type="button"
            onClick={loadStaff}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          {/* Add Staff */}

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            <Plus size={19} />

            Add Staff
          </button>

        </div>

      </div>

      {/* ==========================
          Error
      ========================== */}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* ==========================
          Loading
      ========================== */}

      {loading ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">

          <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4" />

          <p className="text-slate-500">
            Loading staff members...
          </p>

        </div>
      ) : (
        <StaffTable
          staff={staff}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ==========================
          Staff Form
      ========================== */}

      {showForm && (
        <StaffForm
          staff={selectedStaff}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
          loading={saving}
        />
      )}

      {/* ==========================
          Delete Confirmation Modal
      ========================== */}

      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-200">

              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle
                  size={24}
                  className="text-red-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Delete Staff Member
                </h2>

                <p className="text-sm text-slate-500">
                  This action cannot be undone.
                </p>
              </div>

            </div>

            {/* Modal Body */}

            <div className="px-6 py-6">

              <p className="text-slate-600">
                Are you sure you want to delete
                <span className="font-semibold text-slate-800">
                  {" "}
                  {staffToDelete.fullName}
                </span>
                ?
              </p>

              <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">

                <div className="flex items-center gap-3">

                  <Trash2
                    size={18}
                    className="text-red-600"
                  />

                  <div>
                    <p className="font-medium text-red-700">
                      Staff account will be permanently deleted.
                    </p>

                    <p className="text-sm text-red-600 mt-1">
                      {staffToDelete.email}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end gap-3 px-6 py-5 bg-slate-50 rounded-b-2xl">

              {/* Cancel */}

              <button
                type="button"
                onClick={handleCancelDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Delete */}

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50"
              >
                <Trash2 size={17} />

                {deleting
                  ? "Deleting..."
                  : "Delete Staff"}
              </button>

            </div>

          </div>

        </div>
      )}

    </DashboardLayout>
  );
}