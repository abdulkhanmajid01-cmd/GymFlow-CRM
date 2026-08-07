"use client";

export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full
          px-4
          py-3
          border
          rounded-lg
          border-slate-300
          bg-white
          outline-none
          transition-all
          duration-300
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          disabled:bg-slate-100
          disabled:cursor-not-allowed
          ${className}
        `}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}