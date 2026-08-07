"use client";

import { useEffect } from "react";

export default function Modal({

  isOpen,

  onClose,

  title,

  children,

  size = "lg",

}) {

  useEffect(() => {

    if (isOpen) {

      document.body.style.overflow = "hidden";

    } else {

      document.body.style.overflow = "auto";

    }

    return () => {

      document.body.style.overflow = "auto";

    };

  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {

    sm: "max-w-md",

    md: "max-w-2xl",

    lg: "max-w-4xl",

    xl: "max-w-6xl",

  };

  return (

    <div

      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"

      onClick={onClose}

    >

      <div

        onClick={(e) => e.stopPropagation()}

        className={`
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          ${sizes[size]}
          max-h-[90vh]
          flex
          flex-col
          animate-scaleIn
        `}

      >

        {/* Header */}

        <div className="flex items-center justify-between px-6 py-5 border-b">

          <h2 className="text-xl font-semibold">

            {title}

          </h2>

          <button

            onClick={onClose}

            className="text-slate-500 hover:text-red-500 text-2xl transition"

          >

            ×

          </button>

        </div>

        {/* Body */}

        <div

          className="overflow-y-auto p-6"

        >

          {children}

        </div>

      </div>

    </div>

  );

}