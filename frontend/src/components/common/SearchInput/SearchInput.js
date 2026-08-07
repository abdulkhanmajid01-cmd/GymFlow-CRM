"use client";

export default function SearchInput({

  value,

  onChange,

  placeholder = "Search...",

  className = "",

}) {

  return (

    <div className={`relative w-full ${className}`}>

      {/* Search Icon */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      <input

        type="text"

        value={value}

        onChange={onChange}

        placeholder={placeholder}

        className="
          w-full
          pl-12
          pr-4
          py-3
          rounded-lg
          border
          border-slate-300
          bg-white
          outline-none
          transition-all
          duration-300
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-500
        "

      />

    </div>

  );

}