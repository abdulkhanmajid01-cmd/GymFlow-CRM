"use client";

import Button from "../common/Button";
import SearchInput from "../common/SearchInput";

export default function MembershipPlanToolbar({

  search,

  setSearch,

  onAddPlan,

}) {

  return (

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      {/* Search */}

      <div className="w-full md:w-80">

        <SearchInput

          value={search}

          onChange={(e) => setSearch(e.target.value)}

          placeholder="Search Membership Plans..."

        />

      </div>

      {/* Add Button */}

      <Button

        onClick={onAddPlan}

        variant="primary"

      >

        + Add Plan

      </Button>

    </div>

  );

}