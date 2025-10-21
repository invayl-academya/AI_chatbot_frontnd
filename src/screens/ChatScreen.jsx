// src/screens/ChatScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/redux/chatSlice";

const ChatScreen = () => {
  const dispatch = useDispatch();
  const { currentSessionId, sessions, sending, error } = useSelector(
    (s) => s.chat
  );
  const messages = useMemo(() => {
    if (!currentSessionId) return [];
    return sessions[currentSessionId]?.messages || [];
  }, [sessions, currentSessionId]);

  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const onSend = async (e) => {
    e?.preventDefault?.();
    const msg = text.trim();
    if (!msg || sending) return;

    await dispatch(
      sendMessage({
        message: msg,
        // sessionId is optional; if null, backend creates a new one
        sessionId: currentSessionId || null,
      })
    ).unwrap();

    setText("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      onSend(e);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      {/* Header / Status */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          Session:{" "}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {currentSessionId || "(new after first message)"}
          </span>
        </div>
        {sending && (
          <div className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Thinking…
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-[65vh] overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full grid place-items-center text-slate-500 dark:text-slate-400 text-sm">
            Start a conversation with Invayl Tutor ✨
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`w-full flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 whitespace-pre-wrap leading-relaxed
                ${
                  m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                }`}
              >
                <div className="text-[10px] opacity-70 mb-1">{m.role}</div>
                <div>{m.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <form onSubmit={onSend} className="flex gap-2">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask the Invayl Tutor…"
          className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatScreen;
