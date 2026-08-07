"use client";

const variants = {
  success: "bg-green-100 text-green-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
  secondary: "bg-slate-100 text-slate-700",
};

export default function Badge({
  children,
  variant = "secondary",
  className = "",
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}