"use client";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      {/* Page Title */}
      <h2 className="text-2xl font-bold text-slate-800">
        Dashboard
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Profile */}
        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>

          <div>
            <p className="font-semibold text-sm">
              Admin
            </p>

            <p className="text-xs text-slate-500">
              Gym Admin
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}