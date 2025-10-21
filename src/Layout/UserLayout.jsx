// src/Layout/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Top hero/header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-slate-100">
        {/* Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 flex flex-col items-center ">
          <div className="flex items-center gap-3 ">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6l-1-3H2" />
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="17" cy="20" r="1.5" />
              </svg>
            </span>
            <h1 className="text-2xl font-semibold tracking-tight ">
              <span className="text-white">AI</span>{" "}
              <span className="text-cyan-300">chatBot</span>
            </h1>
          </div>

          <p className="mt-6 max-w-2xl text-slate-300">
            Welcome to{" "}
            <span className="font-semibold text-white">AI chatbot</span> — Learn
            to build with our AI TUTOR.
          </p>
        </div>
      </header>

      {/* Content area (Outlet sits directly below header) */}
      <main className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
