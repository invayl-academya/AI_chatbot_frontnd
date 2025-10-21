import { apis } from "@/api/api";
import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  currentSessionId: null,
  sessions: {},
  threads: [],
  sending: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  "chats/sendMessage",
  async (
    { message, sessionId = null, max_output_tokens },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await apis.post("/chat", {
        message,
        session_id: sessionId || null,
        max_output_tokens,
      });

      // data: { reply, session_id, usage }
      const now = new Date().toISOString();
      return {
        sessionId: data.session_id,
        userMessage: {
          id: `u-${nanoid(8)}`,
          role: "user",
          content: message,
          created_at: now,
        },
        assistantMessage: {
          id: `a-${nanoid(8)}`,
          role: "assistant",
          content: data.reply,
          created_at: now,
        },
        usage: data.usage ?? null,
      };
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message";
      return rejectWithValue(msg);
    }
  }
);

// Load messages for a session (when user clicks a thread)
export const fetchHistory = createAsyncThunk(
  "chats/fetchHistory",
  async ({ sessionId, limit = 100 }, { rejectWithValue }) => {
    try {
      const { data } = await apis.get("/chat/history", {
        params: { session_id: sessionId, limit },
      });
      return {
        sessionId: data.session_id || sessionId,
        messages: (data.messages || []).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          created_at: m.created_at,
        })),
      };
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load history";
      return rejectWithValue(msg);
    }
  }
);

// Build thread previews by grouping /chat/all items
export const fetchThreads = createAsyncThunk(
  "chats/fetchThreads",
  async (
    { limit = 300, offset = 0, owner = "me" } = {},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await apis.get("/chat/all", {
        params: { limit, offset, owner },
      });
      // data.items: [{ id, role, content, session_id, created_at, ... }]
      const bySession = new Map();
      for (const m of data.items || []) {
        const sid = m.session_id;
        if (!sid) continue;
        if (!bySession.has(sid)) {
          bySession.set(sid, {
            id: sid,
            lastSnippet: m.content,
            lastAt: m.created_at,
            count: 1,
          });
        } else {
          const t = bySession.get(sid);
          t.count += 1;
          // pick most recent by created_at (items are newest first per backend)
          if (new Date(m.created_at) > new Date(t.lastAt)) {
            t.lastAt = m.created_at;
            t.lastSnippet = m.content;
          }
        }
      }
      const threads = Array.from(bySession.values()).sort(
        (a, b) => new Date(b.lastAt) - new Date(a.lastAt)
      );
      return threads;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.detail || err?.message || "Failed to load sessions"
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    startNewSession(state) {
      state.currentSessionId = null;
      state.error = null;
    },
    setCurrentSession(state, action) {
      const sid = action.payload;
      state.currentSessionId = sid;
      if (!state.sessions[sid]) {
        state.sessions[sid] = { id: sid, messages: [] };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const { sessionId, userMessage, assistantMessage } = action.payload;

        // ensure session bucket exists
        if (!state.sessions[sessionId]) {
          state.sessions[sessionId] = {
            id: sessionId,
            messages: [],
          };
        }

        // adopt session as current if not set
        if (!state.currentSessionId) state.currentSessionId = sessionId;

        // append user + assistant messages
        state.sessions[sessionId].messages.push(userMessage);
        state.sessions[sessionId].messages.push(assistantMessage);

        // update (or insert) thread preview
        const lastSnippet = assistantMessage.content || userMessage.content;
        const lastAt = assistantMessage.created_at;
        const idx = state.threads.findIndex((t) => t.id === sessionId);
        if (idx === -1) {
          state.threads.unshift({
            id: sessionId,
            lastSnippet,
            lastAt,
            count: 2,
          });
        } else {
          state.threads[idx].lastSnippet = lastSnippet;
          state.threads[idx].lastAt = lastAt;
          // move updated thread to top
          const updated = state.threads.splice(idx, 1)[0];
          state.threads.unshift(updated);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || "Failed to send message";
      })

      // history
      .addCase(fetchHistory.fulfilled, (state, action) => {
        const { sessionId, messages } = action.payload;
        if (!state.sessions[sessionId]) {
          state.sessions[sessionId] = { id: sessionId, messages: [] };
        }
        state.sessions[sessionId].messages = messages;
      })

      // threads
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.threads = action.payload;
      });
  },
});

export const { startNewSession, setCurrentSession } = chatSlice.actions;

export default chatSlice.reducer;

//selectors
export const selectThreads = (s) => s.chat.threads;
