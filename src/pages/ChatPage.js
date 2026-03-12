// src/pages/ChatPage.js
// Chat page — wraps the Chat component with page chrome, tips, and sidebar context

import React, { useEffect } from "react";
import { useSession } from "../App";
import { saveBadge } from "../firebase";
import Chat from "../components/Chat";

// ── Conversation Starter Prompts ──────────────────────────────────────────────
const STARTERS = [
  "I've been feeling really low lately…",
  "I'm struggling with drinking and I don't know what to do",
  "I feel like a burden to everyone around me",
  "I need help but I don't know how to ask for it",
  "I've been having thoughts I'm scared of",
];

export default function ChatPage() {
  const { sessionId } = useSession();

  // Award "first_chat" badge when user visits the chat page
  useEffect(() => {
    if (sessionId) {
      saveBadge(sessionId, "first_chat").catch(console.error);
    }
  }, [sessionId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Main Chat Area ──────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <h1 className="font-display text-2xl font-semibold text-warm-800">💬 Chat with Guest AI</h1>
            <p className="text-warm-400 text-sm mt-1">
              Anonymous & private. Share what's on your mind — I'm here to listen.
            </p>
          </div>

          <div className="card flex-1" style={{ minHeight: "500px" }}>
            <Chat />
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div className="lg:w-72 space-y-4">
          {/* Conversation Starters */}
          <div className="card">
            <h3 className="font-display text-base font-semibold text-warm-700 mb-3">
              💡 Not sure what to say?
            </h3>
            <p className="text-xs text-warm-400 mb-3">Tap a prompt to get started:</p>
            <div className="space-y-2">
              {STARTERS.map((starter, i) => (
                <button
                  key={i}
                  onClick={() => {
                    // Dispatch starter to chat input via CustomEvent
                    window.dispatchEvent(new CustomEvent("guestChatStarter", { detail: starter }));
                  }}
                  className="w-full text-left text-sm bg-calm-50 hover:bg-calm-100 border border-calm-100 text-warm-600 rounded-xl px-3 py-2.5 transition-colors duration-150"
                >
                  "{starter}"
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="card bg-sage-50 border-sage-100">
            <h3 className="font-display text-sm font-semibold text-sage-700 mb-2">🔒 Your Privacy</h3>
            <ul className="text-xs text-warm-500 space-y-1.5">
              <li>• No account or login required</li>
              <li>• Conversations are stored anonymously</li>
              <li>• Your session ID is a random code</li>
              <li>• We never share your data</li>
            </ul>
          </div>

          {/* Crisis Resources */}
          <div className="card bg-red-50 border-red-100">
            <h3 className="font-display text-sm font-semibold text-red-700 mb-2">🆘 Immediate Help</h3>
            <div className="space-y-2 text-xs">
              <div>
                <p className="font-semibold text-red-600">988 Lifeline</p>
                <p className="text-warm-500">Call or text <strong>988</strong> — 24/7</p>
              </div>
              <div>
                <p className="font-semibold text-red-600">Crisis Text Line</p>
                <p className="text-warm-500">Text <strong>HOME</strong> to 741741</p>
              </div>
              <div>
                <p className="font-semibold text-red-600">Emergency</p>
                <p className="text-warm-500">Call <strong>911</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
