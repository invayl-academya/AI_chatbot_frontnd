// src/screens/Landing.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Clock,
  Sparkles,
  Code2,
  BookOpen,
} from "lucide-react";

const prompts = [
  "Explain closures in JavaScript with a simple example",
  "Build a FastAPI endpoint for CRUD books",
  "What is the difference between CNN and Transformer?",
  "Optimize this SQL query: SELECT * FROM orders WHERE ...",
];

const Landing = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/chats/ask");
  };

  const usePrompt = (p) => {
    // Optional: pass a preset to ChatScreen via route state (ChatScreen can read it later)
    navigate("/chats/ask", { state: { preset: p } });
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 blur-3xl opacity-30 pointer-events-none">
          <div className="w-[40rem] h-[40rem] rounded-full bg-blue-500/30 absolute -top-24 -left-24" />
          <div className="w-[30rem] h-[30rem] rounded-full bg-indigo-500/30 absolute bottom-0 right-0" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-8 md:pt-24 md:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <Sparkles size={14} />
            Invayl Tutor · AI that teaches like a mentor
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl dark:text-white">
            Learn faster with an
            <span className="mx-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Tutor
            </span>
            built for developers.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-300">
            Ask questions, get runnable examples, and unlock concepts across
            Python, JS/TS, ML, and systems. Designed for clarity, speed, and
            real-world code.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleStart}
              className="rounded-2xl bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700 active:scale-[0.99] transition"
            >
              Start chatting
            </button>
            <Link
              to="/auth/login"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Create account
            </Link>
          </div>

          {/* Prompt chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                onClick={() => usePrompt(p)}
                className="text-xs md:text-sm rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                title="Send this prompt to the Tutor"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={<Brain className="h-5 w-5" />}
            title="Expert guidance"
            desc="Clear, concise answers with runnable code when it matters."
          />
          <Feature
            icon={<MessageSquare className="h-5 w-5" />}
            title="Context aware"
            desc="Follow-up questions refine the answer to your exact scenario."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Private sessions"
            desc="Your chats are scoped to your account with secure auth."
          />
          <Feature
            icon={<Clock className="h-5 w-5" />}
            title="Fast responses"
            desc="Optimized prompts and caching for speedy turnarounds."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          How it works
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Step
            number="1"
            title="Ask anything"
            desc="From MERN bugs to FastAPI auth, ML models, and SQL tuning."
            icon={<BookOpen className="h-5 w-5" />}
          />
          <Step
            number="2"
            title="See code & concepts"
            desc="Concrete examples with brief explanations—no fluff."
            icon={<Code2 className="h-5 w-5" />}
          />
          <Step
            number="3"
            title="Iterate quickly"
            desc="Refine with follow-ups. Save sessions and pick up anytime."
            icon={<Rocket className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            Ready to ship faster?
          </h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Start a chat and keep your best answers saved as sessions.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={handleStart}
              className="rounded-xl bg-blue-600 px-5 py-3 text-white shadow hover:bg-blue-700"
            >
              Open Invayl Tutor
            </button>
            <Link
              to="/auth/register"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:text-blue-300">
      {icon}
    </div>
    <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
      {title}
    </h3>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
  </div>
);

const Step = ({ number, title, desc, icon }) => (
  <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="absolute -top-3 left-5 flex items-center gap-2">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
        {number}
      </span>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {icon}
      </span>
    </div>
    <h4 className="mt-3 font-semibold text-slate-900 dark:text-white">
      {title}
    </h4>
    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
  </div>
);

export default Landing;
