// src/components/Navigation.jsx
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchMe, logout as logoutAction } from "@/redux/authSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handlePrimary = () => {
    if (user) navigate("/chats");
    else navigate("/auth/login");
  };

  // src/components/Navigation.jsx
  useEffect(() => {
    dispatch(fetchMe()); // run once on mount
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  const displayName =
    user?.name?.trim() ||
    user?.username?.trim() ||
    (user?.email ? user.email.split("@")[0] : "");

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/90" />
          <span className="text-lg font-semibold tracking-tight">
            Invayl Tutor
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary font-semibold">
                {displayName?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="text-sm text-muted-foreground">
                Hi,{" "}
                <span className="font-medium text-foreground">
                  {displayName}
                </span>
              </span>
            </div>
          )}

          <Button className="rounded-2xl" onClick={handlePrimary}>
            {user ? "Open Tutor" : "Login"}
          </Button>

          {user && (
            <Button
              variant="outline"
              className="rounded-2xl hidden sm:inline-flex"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
