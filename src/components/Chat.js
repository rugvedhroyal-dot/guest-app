// src/components/Chat.js
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "../App";
import { getAIResponse, detectCrisis, getCrisisResponse } from "../openai";
import { saveChatMessage, loadChatHistory, logEmergencyTrigger } from "../firebase";
import EmergencyContact from "./EmergencyContact";

export default function Chat({ starterText, onStarterUsed }) {
  const { sessionId } = useSession();
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [crisis, setCrisis]             = useState(false);
  const [showContact, setShowContact]   = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load chat history
  useEffect(() => {
    if (!sessionId) return;
    loadChatHistory(sessionId)
      .then((history) => {
        if (history.length > 0) {
          setMessages(history.map((h) => ({ role: h.role, content: h.content })));
        } else {
          setMessages([{ role: "assistant", content: "Hi, I'm glad you're here. 💙 This is a safe, judgment-free space. You can talk to me about anything — how you're feeling, what's on your mind, or just to be heard. What's going on today?" }]);
        }
        setHistoryLoaded(true);
      })
      .catch(() => {
        setMessages([{ role: "assistant", content: "Hi, I'm glad you're here. 💙 What's on your mind today?" }]);
        setHistoryLoaded(true);
      });
  }, [sessionId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

// Listen for starter prompt events
  useEffect(() => {
    const handler = (e) => {
      setInput(e.detail);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    window.addEventListener("guestStarter", handler);
    return () => window.removeEventListener("guestStarter", handler);
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    if (sessionId) saveChatMessage(sessionId, "user", text).catch(console.error);

    if (detectCrisis(text)) {
      setCrisis(true);
      const crisisReply = getCrisisResponse();
      setMessages([...updatedMessages, { role: "assistant", content: crisisReply }]);
      setLoading(false);
      if (sessionId) {
        logEmergencyTrigger(sessionId, text).catch(console.error);
        saveChatMessage(sessionId, "assistant", crisisReply).catch(console.error);
      }
      setTimeout(() => setShowContact(true), 1500);
      return;
    }

    try {
      const reply = await getAIResponse(updatedMessages.map((m) => ({ role: m.role, content: m.content })));
      const aiMsg = { role: "assistant", content: reply };
      setMessages([...updatedMessages, aiMsg]);
      if (sessionId) saveChatMessage(sessionId, "assistant", reply).catch(console.error);
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "I'm having a moment connecting. You're still not alone — try sending again, or call 988." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {crisis && (
        <div className="crisis-banner mb-4 animate-fade-in">
          <p className="font-semibold text-red-700 mb-1">⚠️ You're not alone in this.</p>
          <p className="text-sm">
            Please reach out to the <a href="tel:988" className="font-bold underline">988 Suicide & Crisis Lifeline</a>{" "}
            (call or text <strong>988</strong>) or text <strong>HOME to 741741</strong>. You matter.
          </p>
        </div>
      )}

      {showContact && (
        <div className="mb-4">
          <EmergencyContact onClose={() => setShowContact(false)} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pb-2 px-1" style={{ maxHeight: "calc(100vh - 320px)", minHeight: "300px" }}>
        {!historyLoaded ? (
          <div className="flex justify-center pt-8">
            <div className="w-8 h-8 border-2 border-calm-200 border-t-calm-500 rounded-full animate-spin" />
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🌿</div>
              )}
              <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"} style={{ whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                  part.startsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🌿</div>
            <div className="chat-bubble-ai flex items-center gap-1 py-3">
              <span className="w-2 h-2 bg-calm-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-calm-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-calm-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind… (Enter to send)"
          rows={2}
          className="input-field flex-1 resize-none"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn-primary px-5 py-3 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-xs text-warm-400 text-center mt-2">
        🔒 Anonymous mode — no login required. Your conversation is private to your session.
      </p>
    </div>
  );
}