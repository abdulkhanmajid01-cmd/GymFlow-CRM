"use client";

// React
import { useEffect, useState } from "react";

// Layout
import DashboardLayout from "../../components/layout/DashboardLayout";

// Components
import MembershipPlanTable from "../../components/membership-plans/MembershipPlanTable";
import MembershipPlanToolbar from "../../components/membership-plans/MembershipPlanToolbar";
import MembershipPlanForm from "../../components/membership-plans/MembershipPlanForm";

import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";

// Services
import {
  getAllMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from "../../services/membershipPlanService";

export default function MembershipPlansPage() {
  // ===========================
  // States
  // ===========================

  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [deletePlan, setDeletePlan] = useState(null);

  // ===========================
  // Fetch Membership Plans
  // ===========================

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const response = await getAllMembershipPlans();

      setPlans(response.data);
      setError("");
    } catch (err) {
      console.error(err);

      setError("Failed to load membership plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ===========================
  // Create / Update Plan
  // ===========================

  const handleSavePlan = async (planData) => {
    try {
      setSaving(true);

      if (editingPlan) {
        await updateMembershipPlan(
          editingPlan._id,
          planData
        );
      } else {
        await createMembershipPlan(planData);
      }

      await fetchPlans();

      setEditingPlan(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);

      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ===========================
  // Delete Plan
  // ===========================

  const handleDeletePlan = async () => {
    if (!deletePlan) return;

    try {
      await deleteMembershipPlan(deletePlan._id);

      await fetchPlans();

      setDeletePlan(null);
    } catch (err) {
      console.error(err);

      alert(err.message);
    }
  };

  // ===========================
  // Search Filter
  // ===========================

  const filteredPlans = plans.filter((plan) =>
    plan.planName
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>

      {/* ===========================
          Header
      =========================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Membership Plans
        </h1>

        <p className="text-slate-500 mt-2">
          Manage all membership plans.
        </p>

      </div>

      {/* ===========================
          Toolbar
      =========================== */}

      <MembershipPlanToolbar
        search={search}
        setSearch={setSearch}
        onAddPlan={() => {
          setEditingPlan(null);
          setIsModalOpen(true);
        }}
      />

      {/* ===========================
          Content
      =========================== */}

      {loading ? (

        <Loader
          text="Loading Membership Plans..."
        />

      ) : error ? (

        <div className="text-red-600">
          {error}
        </div>

      ) : filteredPlans.length === 0 ? (

        <EmptyState
          title="No Membership Plans"
          description="Create your first membership plan."
        />

      ) : (

        <MembershipPlanTable

          plans={filteredPlans}

          onEdit={(plan) => {
            setEditingPlan(plan);
            setIsModalOpen(true);
          }}

          onDelete={(plan) => {
            setDeletePlan(plan);
          }}

        />

      )}

      {/* ===========================
          Add / Edit Modal
      =========================== */}

      <Modal

        isOpen={isModalOpen}

        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}

        title={
          editingPlan
            ? "Edit Membership Plan"
            : "Add Membership Plan"
        }

        size="lg"

      >

        <MembershipPlanForm

          initialData={editingPlan || {}}

          onSubmit={handleSavePlan}

          loading={saving}

        />

      </Modal>

      {/* ===========================
          Delete Confirmation Modal
      =========================== */}

      <Modal

        isOpen={!!deletePlan}

        onClose={() => setDeletePlan(null)}

        title="Delete Membership Plan"

        size="sm"

      >

        <div className="space-y-5">

          <p className="text-slate-600">

            Are you sure you want to delete{" "}

            <span className="font-semibold text-slate-900">

              {deletePlan?.planName}

            </span>

            ?

          </p>

          <div className="flex justify-end gap-3">

            <button

              type="button"

              onClick={() => setDeletePlan(null)}

              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"

            >

              Cancel

            </button>

            <button

              type="button"

              onClick={handleDeletePlan}

              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"

            >

              Delete

            </button>

          </div>

        </div>

      </Modal>

    </DashboardLayout>
  );
}