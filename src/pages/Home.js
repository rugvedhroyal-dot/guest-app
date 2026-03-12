// src/pages/Home.js
// Welcome home page with navigation, visitor counter, mood check-in, and badges

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../App";
import { saveBadge } from "../firebase";
import VisitorCounter from "../components/VisitorCounter";
import MoodTracker from "../components/MoodTracker";
import Badges from "../components/Badges";
import EmergencyContact from "../components/EmergencyContact";

// ── Feature cards for the home page ──────────────────────────────────────────
const FEATURE_CARDS = [
  {
    to: "/chat",
    emoji: "💬",
    title: "Talk to Someone",
    description: "Chat with an AI companion who listens without judgment, any time of day.",
    color: "from-calm-400 to-calm-600",
    textColor: "text-white",
  },
  {
    to: "/resources",
    emoji: "📚",
    title: "Find Resources",
    description: "Explore mental health hotlines, recovery programs, and community support.",
    color: "from-sage-400 to-sage-600",
    textColor: "text-white",
  },
];

export default function Home() {
  const { sessionId } = useSession();

  // Award "explorer" badge for visiting home after resources
  useEffect(() => {
    if (sessionId) {
      // Award first_chat badge trigger — actual awarding happens in Chat.js
    }
  }, [sessionId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-br from-calm-100 to-sage-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-soft">
          🌿
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-warm-800 mb-4 leading-tight">
          You are not alone.
        </h1>
        <p className="text-warm-500 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-6">
          Guest is a safe, compassionate space for anyone struggling with addiction, depression, alcohol use, or difficult emotions. No judgment. No login required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link to="/chat" className="btn-primary text-base px-8 py-3.5">
            💬 Start Talking
          </Link>
          <Link to="/resources" className="btn-secondary text-base px-8 py-3.5">
            📚 Find Help Near You
          </Link>
        </div>

        {/* Crisis Line Callout */}
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 text-sm">
          <span className="text-red-500">🆘</span>
          <span className="text-red-700">
            In crisis right now?{" "}
            <a href="tel:988" className="font-bold underline">Call or text 988</a>
            {" "}— free, 24/7.
          </span>
        </div>

        {/* Visitor Counter */}
        <div className="mt-5">
          <VisitorCounter className="justify-center text-sm" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid sm:grid-cols-2 gap-5">
        {FEATURE_CARDS.map(({ to, emoji, title, description, color, textColor }) => (
          <Link
            key={to}
            to={to}
            className={`block bg-gradient-to-br ${color} rounded-3xl p-6 shadow-card hover:shadow-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
          >
            <span className="text-4xl block mb-3">{emoji}</span>
            <h2 className={`font-display text-xl font-semibold ${textColor} mb-2`}>{title}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{description}</p>
          </Link>
        ))}
      </section>

      {/* Quick Stats / "What is Guest?" */}
      <section className="card text-center">
        <h2 className="font-display text-2xl text-warm-800 mb-5">What is Guest?</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { emoji: "🔒", value: "Anonymous", label: "No login required" },
            { emoji: "💙", value: "Free",      label: "Always free to use" },
            { emoji: "🌍", value: "24/7",      label: "Always available" },
          ].map(({ emoji, value, label }) => (
            <div key={value} className="text-center">
              <p className="text-3xl mb-1">{emoji}</p>
              <p className="font-display text-lg font-semibold text-calm-700">{value}</p>
              <p className="text-xs text-warm-400">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-warm-500 text-sm max-w-lg mx-auto">
          Whether you're dealing with addiction, alcohol use, depression, anxiety, grief, or just feeling lost — Guest is here to listen, support, and connect you with real resources.
        </p>
      </section>

      {/* Mood Tracker */}
      <section>
        <h2 className="section-title text-center mb-5">🌡️ Daily Check-In</h2>
        <MoodTracker />
      </section>

      {/* Badges */}
      <section>
        <Badges />
      </section>

      {/* Emergency Contact */}
      <section>
        <h2 className="section-title text-center mb-5">🤝 Your Support Network</h2>
        <EmergencyContact compact={true} />
      </section>

      {/* Community Quote */}
      <section className="bg-gradient-to-br from-sage-50 to-calm-50 rounded-3xl p-8 text-center border border-sage-100">
        <p className="font-display text-xl italic text-warm-700 mb-3">
          "Recovery is not a race. You don't have to feel guilty if it takes longer than you thought it would."
        </p>
        <p className="text-warm-400 text-sm">— A reminder for all of us</p>
      </section>
    </div>
  );
}
