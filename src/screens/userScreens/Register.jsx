// src/screens/userScreens/Register.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/authSlice";
import { apis } from "@/api/api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) {
      navigate("/chats/ask");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "employee", // backend default
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Valid email is required";
    if (form.username.trim().length < 3)
      return "Username must be at least 3 chars";
    if (form.password.length < 6) return "Password must be at least 6 chars";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      // 1) Create account
      await apis.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        username: form.username.trim(),
        password: form.password,
        role: form.role,
      });

      // 2) Auto-login using your existing thunk
      await dispatch(
        loginUser({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        })
      ).unwrap();

      // 3) Go straight to the Tutor
      navigate("/chats/ask");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
          Create your Invayl account
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Sign up to start using the AI Tutor.
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">
              Full name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="john doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">
              Username
            </label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="johndoe"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Min 6 characters.
            </p>
          </div>

          {/* Role (optional) */}
          <div>
            <label className="block text-sm text-slate-700 dark:text-slate-200">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="employee">employee</option>
              <option value="instructor">user</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/auth/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
