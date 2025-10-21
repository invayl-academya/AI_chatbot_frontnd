// src/redux/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis, clearAuthHeader, setAuthHeader } from "@/api/api";

const defaults = {
  user: null,
  token: null,
  tokenType: "Bearer",
  status: "idle",
  error: null,
};

// OPTIONAL: start with whatever is in storage (helps first paint after refresh)
const saved = JSON.parse(localStorage.getItem("auth") || "null");
const initialState = saved
  ? { ...defaults, ...saved, status: "idle", error: null }
  : defaults;

// --- THUNKS ---
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formdata, { rejectWithValue }) => {
    try {
      const { data } = await apis.post(`/auth/login`, formdata);
      return {
        token: data.access_token,
        tokenType: (data.token_type || "bearer").replace(/^./, (c) =>
          c.toUpperCase()
        ), // "Bearer"
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          username: data.username,
          role: data.role,
        },
      };
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      return rejectWithValue(msg);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apis.get("/auth/me"); // Authorization header must be set
      return data; // backend returns a flat user
    } catch (err) {
      return rejectWithValue(err?.response?.data?.detail || "Unauthorized");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateFromStorage(state) {
      const saved = JSON.parse(localStorage.getItem("auth") || "null");
      if (saved?.token) {
        state.user = saved.user;
        state.token = saved.token;
        state.tokenType = saved.tokenType || "Bearer";
        setAuthHeader(state.token, state.tokenType); // reattach for future calls
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.tokenType = "Bearer";
      state.status = "idle";
      state.error = null;
      clearAuthHeader();
      localStorage.removeItem("auth");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tokenType = action.payload.tokenType || "Bearer";
        state.error = null;

        // Attach header now…
        setAuthHeader(state.token, state.tokenType);

        // …and persist so refresh keeps you logged in
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: state.user,
            token: state.token,
            tokenType: state.tokenType,
          })
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        // ✅ This was wrong in your code. On reject, don’t set user/token.
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        // backend returns a flat user
        state.user = action.payload;
      });
  },
});

export const { logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;
