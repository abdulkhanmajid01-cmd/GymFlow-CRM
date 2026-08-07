"use client";

import { useState } from "react";

import DataTable from "../common/DataTable";
import Badge from "../common/Badge";
import EmptyState from "../common/EmptyState";
import Button from "../common/Button";

export default function MembershipPlanTable({

  plans,

  onEdit,

  onDelete,

}) {

  const [hoveredPlan, setHoveredPlan] = useState(null);

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  };

  const columns = [

    {
      key: "planName",
      title: "Plan",
    },

    {
      key: "durationInMonths",
      title: "Duration",
      render: (row) => `${row.durationInMonths} Month`,
    },

    {
      key: "price",
      title: "Price",
      render: (row) => `PKR ${row.price.toLocaleString()}`,
    },

    {
      key: "description",
      title: "Description",
      render: (row) =>

        row.description

          ? row.description.length > 45

            ? row.description.substring(0, 45) + "..."

            : row.description

          : "-",
    },

   {
  key: "features",
  title: "Features",

  render: (row) => (
    <div
      className="relative"
      onMouseEnter={() => setHoveredPlan(row._id)}
      onMouseLeave={() => setHoveredPlan(null)}
    >
      {row.features?.length ? (
        <>
          {/* First Feature */}
          <div className="font-medium text-slate-700">
            {row.features[0]}
          </div>

          {/* Hover Trigger */}
          {row.features.length > 1 && (
            <div className="text-blue-600 text-sm mt-1 cursor-pointer">
              View All ({row.features.length})
            </div>
          )}

          {/* Hover Popup */}
          {hoveredPlan === row._id && row.features.length > 1 && (
            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                top-full
                mt-3
                z-[9999]
                w-80
                bg-white
                border
                border-slate-200
                rounded-xl
                shadow-2xl
                p-5

                animate-[featurePopup_0.2s_ease-out]
              "
            >

              {/* Arrow */}
              <div
                className="
                  absolute
                  -top-2
                  left-1/2
                  -translate-x-1/2
                  w-4
                  h-4
                  bg-white
                  border-l
                  border-t
                  border-slate-200
                  rotate-45
                "
              />

              {/* Header */}
              <div className="mb-4 relative">

                <h4 className="font-semibold text-slate-800">
                  Plan Features
                </h4>

              </div>

              {/* Features */}
              <ul className="space-y-3">

                {row.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-700"
                    style={{
                      animation: "featureFadeIn 0.25s ease-out forwards",
                      animationDelay: `${index * 60}ms`,
                      opacity: 0,
                    }}
                  >
                    <span className="text-green-500 font-bold">
                      ✓
                    </span>

                    <span>
                      {feature}
                    </span>
                  </li>
                ))}

              </ul>

              {/* Total */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Total Features:{" "}
                <span className="font-semibold text-slate-700">
                  {row.features.length}
                </span>
              </div>

            </div>
          )}
        </>
      ) : (
        "-"
      )}
    </div>
  ),
},

    {

      key: "status",

      title: "Status",

      render: (row) => (

        row.isActive

          ? <Badge variant="success">Active</Badge>

          : <Badge variant="danger">Inactive</Badge>

      ),

    },

    {

      key: "createdAt",

      title: "Created",

      render: (row) => formatDate(row.createdAt),

    },

    {

      key: "updatedAt",

      title: "Updated",

      render: (row) => formatDate(row.updatedAt),

    },

   {
  key: "actions",

  title: "Actions",

  render: (row) => (

    <div className="flex gap-2">

      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(row)}
      >
        ✏️
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(row)}
      >
        🗑️
      </Button>

    </div>

  ),

},

  ];

  return (

    <DataTable

      columns={columns}

      data={plans}

      emptyState={

        <EmptyState

          title="No Membership Plans"

          description="Create your first membership plan."

        />

      }

    />

  );

}