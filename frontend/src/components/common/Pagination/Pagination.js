"use client";

export default function Pagination({

  currentPage,

  totalPages,

  onPageChange,

}) {

  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {

    pages.push(i);

  }

  return (

    <div className="flex items-center justify-center gap-2 mt-6">

      <button

        onClick={() => onPageChange(currentPage - 1)}

        disabled={currentPage === 1}

        className="
          px-3
          py-2
          rounded-lg
          border
          border-slate-300
          disabled:opacity-50
          disabled:cursor-not-allowed
          hover:bg-slate-100
          transition-all
        "

      >

        Previous

      </button>

      {pages.map((page) => (

        <button

          key={page}

          onClick={() => onPageChange(page)}

          className={`
            w-10
            h-10
            rounded-lg
            transition-all

            ${
              currentPage === page

                ? "bg-blue-600 text-white"

                : "bg-white border border-slate-300 hover:bg-slate-100"
            }
          `}

        >

          {page}

        </button>

      ))}

      <button

        onClick={() => onPageChange(currentPage + 1)}

        disabled={currentPage === totalPages}

        className="
          px-3
          py-2
          rounded-lg
          border
          border-slate-300
          disabled:opacity-50
          disabled:cursor-not-allowed
          hover:bg-slate-100
          transition-all
        "

      >

        Next

      </button>

    </div>

  );

}