"use client";

import SearchInput from "../common/SearchInput";
import Button from "../common/Button";

export default function MemberToolbar({
  search,
  setSearch,
  onAddMember,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Search */}
      <div className="w-full md:max-w-sm">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search members..."
        />
      </div>

      {/* Add Member */}
      <Button
        variant="primary"
        onClick={onAddMember}
      >
        + Add Member
      </Button>

    </div>
  );
}