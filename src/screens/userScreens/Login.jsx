import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logout } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const dispatch = useDispatch();

  const { user, status, error } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect back to where user came from, if provided (?from=/somewhere)
  const from = new URLSearchParams(location.search).get("from") || "/";

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  }

  if (user) {
    return (
      <div className="rounded-2xl border p-4 bg-background">
        <p className="mb-3 text-sm text-foreground/80">
          Signed in as <span className="font-medium">{user.email}</span>
        </p>
        <Button
          variant="outline"
          className="rounded-2xl"
          onClick={() => dispatch(logoutAction())}
        >
          Logout
        </Button>
      </div>
    );
  }
  return (
    <div className="max-w-sm rounded-2xl border p-5">
      <h2 className="mb-4 text-xl font-semibold">Sign in</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={status === "loading"}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          className="w-full rounded-2xl"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
