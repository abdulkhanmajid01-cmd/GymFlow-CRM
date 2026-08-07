"use client";

export default function Loader({

  size = "md",

  text = "",

  fullScreen = false,

}) {

  const sizes = {

    sm: "w-5 h-5",

    md: "w-8 h-8",

    lg: "w-12 h-12",

  };

  const content = (

    <div className="flex flex-col items-center justify-center gap-3">

      <div

        className={`
          ${sizes[size]}
          border-4
          border-blue-200
          border-t-blue-600
          rounded-full
          animate-spin
        `}

      />

      {text && (

        <p className="text-sm text-slate-500">

          {text}

        </p>

      )}

    </div>

  );

  if (fullScreen) {

    return (

      <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">

        {content}

      </div>

    );

  }

  return content;

}