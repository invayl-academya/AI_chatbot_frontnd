// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Login from "@/screens/userScreens/Login";
import Register from "@/screens/userScreens/Register";
import UserLayout from "@/Layout/UserLayout";
import { fetchMe, hydrateFromStorage } from "./redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setAuthHeader } from "./api/api";
import ChatScreen from "./screens/ChatScreen";
import ChatsLayout from "./Layout/ChatsLayout";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(hydrateFromStorage()); // sets header if token exists
  }, [dispatch]);

  useEffect(() => {
    if (token) dispatch(fetchMe()); // now /auth/me will succeed
  }, [dispatch, token]);
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Boot: try to load user from cookie */}
      {/* Always visible header */}
      <Navigation />

      <Routes>
        {/* Home */}

        <Route path="/chats" element={<ChatsLayout />}>
          <Route index element={<Navigate to="ask" replace />} />
          <Route path="ask" element={<ChatScreen />} />
        </Route>

        {/* Auth (full-screen grid from UserLayout) */}
        <Route path="/auth" element={<UserLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* (Optional) catch-all */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;
