"use client";

export default function Card({

  children,

  title,

  subtitle,

  headerAction,

  className = "",

}) {

  return (

    <div
      className={`
        bg-white
        rounded-xl
        border
        border-slate-200
        shadow-sm
        p-6
        ${className}
      `}
    >

      {(title || subtitle || headerAction) && (

        <div className="flex items-start justify-between mb-6">

          <div>

            {title && (
              <h2 className="text-xl font-semibold text-slate-900">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">
                {subtitle}
              </p>
            )}

          </div>

          {headerAction && (
            <div>
              {headerAction}
            </div>
          )}

        </div>

      )}

      {children}

    </div>

  );

}