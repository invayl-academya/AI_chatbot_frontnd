import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Menu, Plus, MessageCircle, X } from "lucide-react";

const ChatsLayout = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewChat = () => {
    // TODO: when we add startNewSession(), dispatch it here
    navigate("/chats/ask");
    setOpen(false);
  };

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex md:flex-col border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-56px)]">
          <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Chats
            </span>
          </div>

          <div className="p-3 space-y-3">
            <button
              onClick={handleNewChat}
              className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Plus size={18} />
              <span>New chat</span>
            </button>

            <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Sessions (coming soon)
            </div>

            {/* Placeholder list; wire to Redux later */}
            <ul className="space-y-1">
              <li className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-600 dark:text-slate-300 border border-dashed border-slate-200 dark:border-slate-700">
                <MessageCircle size={16} />
                No saved sessions yet
              </li>
            </ul>
          </div>
        </aside>

        {/* Sidebar (mobile drawer) */}
        {open && (
          <div className="md:hidden fixed inset-0 z-40">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-[80%] max-w-[320px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col">
              <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold">Chats</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 space-y-3">
                <button
                  onClick={handleNewChat}
                  className="w-full inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Plus size={18} />
                  <span>New chat</span>
                </button>

                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Sessions (coming soon)
                </div>

                <ul className="space-y-1">
                  <li className="flex items-center gap-2 px-2 py-2 rounded-lg text-slate-600 dark:text-slate-300 border border-dashed border-slate-200 dark:border-slate-700">
                    <MessageCircle size={16} />
                    No saved sessions yet
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="min-h-[calc(100vh-56px)]">
          {/* Mobile header */}
          <div className="md:hidden h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="font-medium">Invayl Tutor</div>
            <div className="w-9" />
          </div>

          <div className="p-4">
            {/* Nested route content (ChatScreen) */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatsLayout;
