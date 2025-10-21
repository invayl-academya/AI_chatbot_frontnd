import React, { useState, useRef, useEffect } from "react";
import { askTutor } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// simple bubble component
function Bubble({ role, children }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={[
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m Invayl Tutor. Ask me anything about Python, ML, or DL.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const scrollRef = useRef(null);

  // auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    // push user message optimistically
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await askTutor(text, 300);
      const reply = data?.reply || "(No reply text)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Sorry—there was an error calling the tutor.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-4xl grid-rows-[auto,1fr,auto] gap-4 p-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            Invayl Tutor – Python • ML • DL
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">
          Concise explanations, runnable code, and a small exercise—ask away!
        </CardContent>
      </Card>

      <Card className="flex min-h-[420px] flex-col">
        <CardContent className="flex flex-1 flex-col p-0">
          <ScrollArea className="h-[420px] px-4 py-4" ref={scrollRef}>
            <div className="flex flex-col gap-3">
              {messages.map((m, idx) => (
                <Bubble key={idx} role={m.role}>
                  {m.content}
                </Bubble>
              ))}
              {loading && (
                <div className="text-xs text-muted-foreground px-2">
                  Thinking…
                </div>
              )}
            </div>
          </ScrollArea>
          <Separator />
          <div className="flex items-end gap-2 p-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Python lists, sklearn train/test split, PyTorch training loop..."
              className="min-h-[64px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={loading}
              className="self-stretch rounded-2xl"
            >
              {loading ? "Sending…" : "Send"}
            </Button>
          </div>
          {errorMsg && (
            <div className="px-3 pb-3 text-xs text-red-600">{errorMsg}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
