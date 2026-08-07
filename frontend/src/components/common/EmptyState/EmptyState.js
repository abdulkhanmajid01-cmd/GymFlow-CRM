"use client";

export default function EmptyState({

  title = "No Data Found",

  description = "There is nothing to display.",

  action = null,

}) {

  return (

    <div className="w-full py-16 flex flex-col items-center justify-center text-center">

      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 13h6m-6 4h6M7 3h8l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z"
          />
        </svg>

      </div>

      <h2 className="text-xl font-semibold text-slate-800">

        {title}

      </h2>

      <p className="text-slate-500 mt-2 max-w-md">

        {description}

      </p>

      {action && (

        <div className="mt-6">

          {action}

        </div>

      )}

    </div>

  );

}