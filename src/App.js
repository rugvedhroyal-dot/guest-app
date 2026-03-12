// src/App.js
// Root application component — sets up routing, anonymous auth, visitor tracking,
// and session management. Wraps the whole app in a shared SessionContext.

import React, { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { signInAnon, onAuthStateChanged, incrementVisitor } from "./firebase";
import { auth } from "./firebase";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import Resources from "./pages/Resources";
import AdminDashboard from "./pages/AdminDashboard";

// ─── Session Context ──────────────────────────────────────────────────────────
// Provides sessionId and user info to all child components
export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

// ─── Admin Password ───────────────────────────────────────────────────────────
// Simple client-side admin guard — set your own password in .env as REACT_APP_ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || "guest-admin-2024";

function AdminGuard({ children }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authed) return children;

  return (
    <div className="min-h-screen flex items-center justify-center bg-calm-50">
      <div className="card max-w-sm w-full mx-4 text-center">
        <h2 className="font-display text-2xl text-warm-800 mb-2">Admin Access</h2>
        <p className="text-warm-500 text-sm mb-6">Enter the admin password to continue.</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Password"
          className="input-field mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">Incorrect password. Try again.</p>}
        <button onClick={handleLogin} className="btn-primary w-full">Sign In</button>
      </div>
    </div>
  );
}

// ─── App Component ────────────────────────────────────────────────────────────
function App() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  // Subscribe to Firebase auth state — sign in anonymously if no user
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      // Use Firebase UID as session identifier
      setSessionId(user.uid);
      setLoading(false);
    } else {
      signInAnon().then((user) => {
        if (user) {
          setSessionId(user.uid);
        } else {
          // Fallback: random session ID if Firebase auth fails
          setSessionId("anon_" + Math.random().toString(36).substr(2, 12));
        }
        setLoading(false);
      });
    }
  });

  // Track this visit
  incrementVisitor();

  return () => unsubscribe();
}, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calm-50">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 border-4 border-calm-300 border-t-calm-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-lg text-calm-600">Welcome to Guest…</p>
        </div>
      </div>
    );
  }

  return (
    <SessionContext.Provider value={{ sessionId }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-calm-50">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/chat"     element={<ChatPage />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/admin"    element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SessionContext.Provider>
  );
}

// Fix: import auth separately

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-calm-100 py-6 mt-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-warm-400 text-sm font-body">
          🌿 Guest — a safe space for everyone.{" "}
          <span className="text-calm-500 font-medium">
            Crisis? Call or text 988.
          </span>{" "}
          Text HOME to 741741 for Crisis Text Line.
        </p>
        <p className="text-warm-300 text-xs mt-1">
          Not a substitute for professional help. All conversations are anonymous.
        </p>
      </div>
    </footer>
  );
}

export default App;
