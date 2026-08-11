"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  role: "receptionist",
  isActive: true,
};

export default function StaffForm({
  staff,
  onSubmit,
  onClose,
  loading = false,
}) {
  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] = useState("");

  const isEditing = Boolean(staff);

  // ==========================
  // Load Staff For Editing
  // ==========================
  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName || "",
        email: staff.email || "",
        password: "",
        role: staff.role || "receptionist",
        isActive:
          staff.isActive !== false,
      });
    } else {
      setFormData(initialForm);
    }

    setError("");
  }, [staff]);

  // ==========================
  // Handle Input
  // ==========================
  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================
  // Submit
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!isEditing && !formData.password) {
      setError("Password is required.");
      return;
    }

    if (
      formData.password &&
      formData.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      const dataToSubmit = {
        fullName:
          formData.fullName.trim(),
        email:
          formData.email.trim(),
        role: formData.role,
        isActive: formData.isActive,
      };

      // Only send password when provided
      if (formData.password) {
        dataToSubmit.password =
          formData.password;
      }

      await onSubmit(dataToSubmit);

      setFormData(initialForm);
    } catch (error) {
      setError(
        error?.message ||
          "Failed to save staff member."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing
                ? "Edit Staff"
                : "Add Staff"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              {isEditing
                ? "Update staff account details."
                : "Create a receptionist or trainer account."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Error */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
              {isEditing && (
                <span className="text-xs text-slate-400 ml-2">
                  Leave blank to keep current password
                </span>
              )}
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                isEditing
                  ? "Enter new password"
                  : "Enter password"
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="receptionist">
                Receptionist
              </option>

              <option value="trainer">
                Trainer
              </option>
            </select>
          </div>

          {/* Status */}

          {isEditing && (
            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4"
              />

              <span className="text-sm font-medium text-slate-700">
                Active Staff Account
              </span>

            </label>
          )}

          {/* Buttons */}

          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Staff"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}