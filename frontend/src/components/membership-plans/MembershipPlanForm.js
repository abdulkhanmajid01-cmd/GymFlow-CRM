"use client";

import { useEffect, useState } from "react";

import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

export default function MembershipPlanForm({

  onSubmit,

  initialData = {},

  loading = false,

}) {

  const [planName, setPlanName] = useState(
    initialData.planName || ""
  );

  const [durationInMonths, setDurationInMonths] = useState(
    initialData.durationInMonths || ""
  );

  const [price, setPrice] = useState(
    initialData.price || ""
  );

  const [description, setDescription] = useState(
    initialData.description || ""
  );

  const [features, setFeatures] = useState(
    initialData.features?.length
      ? initialData.features
      : [""]
  );

  const [isActive, setIsActive] = useState(
    initialData.isActive ?? true

  );
  useEffect(() => {

  setPlanName(initialData.planName || "");

  setDurationInMonths(
    initialData.durationInMonths || ""
  );

  setPrice(
    initialData.price || ""
  );

  setDescription(
    initialData.description || ""
  );

  setFeatures(
    initialData.features?.length
      ? initialData.features
      : [""]
  );

  setIsActive(
    initialData.isActive ?? true
  );

}, [initialData]);

  // ======================
  // Feature Functions
  // ======================

  const addFeature = () => {

    setFeatures([
      ...features,
      "",
    ]);

  };

  const updateFeature = (index, value) => {

    const updated = [...features];

    updated[index] = value;

    setFeatures(updated);

  };

  const removeFeature = (index) => {

    const updated = [...features];

    updated.splice(index, 1);

    setFeatures(updated);

  };

  // ======================
  // Submit
  // ======================

  const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit({

      planName,

      durationInMonths: Number(durationInMonths),

      price: Number(price),

      description,

      features: features.filter(
        (item) => item.trim() !== ""
      ),

      isActive,

    });

  };

  return (

    <Card

      title={
        initialData._id
          ? "Update Membership Plan"
          : "Create Membership Plan"
      }

      subtitle="Fill all required details"

    >

      <form

        onSubmit={handleSubmit}

        className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"

      >

        <Input

          label="Plan Name"

          value={planName}

          onChange={(e) =>
            setPlanName(e.target.value)
          }

          placeholder="Gold"

          required

        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <Input

            label="Duration (Months)"

            type="number"

            value={durationInMonths}

            onChange={(e) =>
              setDurationInMonths(e.target.value)
            }

            placeholder="12"

            required

          />

          <Input

            label="Price"

            type="number"

            value={price}

            onChange={(e) =>
              setPrice(e.target.value)
            }

            placeholder="15000"

            required

          />

        </div>

        <div>

          <label className="block text-sm font-medium text-slate-700 mb-2">

            Description

          </label>

          <textarea

            rows={4}

            value={description}

            onChange={(e) =>
              setDescription(e.target.value)
            }

            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"

            placeholder="Membership description"

          />

        </div>

        <div>

          <div className="flex items-center justify-between mb-3">

            <label className="text-sm font-medium text-slate-700">

              Features

            </label>

            <Button

              type="button"

              variant="outline"

              size="sm"

              onClick={addFeature}

            >

              + Add Feature

            </Button>

          </div>
                    <div className="space-y-3">

            {features.map((feature, index) => (

              <div

                key={index}

                className="flex items-center gap-3"

              >

                <Input

                  value={feature}

                  onChange={(e) =>
                    updateFeature(index, e.target.value)
                  }

                  placeholder={`Feature ${index + 1}`}

                />

                {features.length > 1 && (

                  <Button

                    type="button"

                    variant="danger"

                    size="sm"

                    onClick={() => removeFeature(index)}

                  >

                    ✕
                  </Button>

                )}

              </div>

            ))}

          </div>

        </div>

        <div className="flex items-center gap-3">

          <input

            id="activePlan"

            type="checkbox"

            checked={isActive}

            onChange={(e) =>
              setIsActive(e.target.checked)
            }

            className="w-5 h-5 accent-blue-600"

          />

          <label

            htmlFor="activePlan"

            className="text-sm font-medium text-slate-700"

          >

            Active Membership Plan

          </label>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">

          <Button

            type="submit"

            variant="primary"

            loading={loading}

          >

            {initialData._id

              ? "Update Plan"

              : "Save Membership Plan"}

          </Button>

        </div>

      </form>

    </Card>

  );

}