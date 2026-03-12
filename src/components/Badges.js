// src/components/Badges.js
// Gamification / badges system — displays earned achievements and progress
// Badges are stored in Firebase and awarded throughout the app.

import React, { useState, useEffect } from "react";
import { useSession } from "../App";
import { loadBadges } from "../firebase";

// ── Badge Definitions ─────────────────────────────────────────────────────────
const ALL_BADGES = [
  {
    id: "first_mood",
    emoji: "🌱",
    name: "First Step",
    description: "Logged your first mood",
    color: "bg-green-50 border-green-200",
  },
  {
    id: "week_streak",
    emoji: "🌟",
    name: "Week Warrior",
    description: "7 days of mood tracking",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "month_streak",
    emoji: "🏆",
    name: "Month Strong",
    description: "30 days of mood tracking",
    color: "bg-amber-50 border-amber-200",
  },
  {
    id: "first_chat",
    emoji: "💬",
    name: "Open Up",
    description: "Started your first chat",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "reached_out",
    emoji: "🤝",
    name: "Reached Out",
    description: "Added an emergency contact",
    color: "bg-purple-50 border-purple-200",
  },
  {
    id: "resources_explored",
    emoji: "📚",
    name: "Explorer",
    description: "Visited the Resources page",
    color: "bg-teal-50 border-teal-200",
  },
  {
    id: "brave",
    emoji: "💪",
    name: "Brave Heart",
    description: "Stayed with us through a hard moment",
    color: "bg-red-50 border-red-200",
  },
  {
    id: "journal_5",
    emoji: "📓",
    name: "Journaler",
    description: "Added 5 mood notes",
    color: "bg-indigo-50 border-indigo-200",
  },
];

export default function Badges() {
  const { sessionId } = useSession();
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    loadBadges(sessionId)
      .then((badges) => {
        setEarned(badges);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const earnedCount = earned.length;
  const totalCount  = ALL_BADGES.length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title mb-0">🏅 Your Achievements</h3>
        <span className="text-sm text-warm-400 font-medium">
          {earnedCount}/{totalCount} earned
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-calm-100 rounded-full h-2 mb-5">
        <div
          className="bg-calm-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(earnedCount / totalCount) * 100}%` }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-calm-200 border-t-calm-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_BADGES.map((badge) => {
            const isEarned = earned.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-3 text-center transition-all duration-200
                  ${isEarned ? badge.color : "bg-gray-50 border-gray-200 opacity-40 grayscale"}`}
              >
                <span className="text-3xl block mb-1">{badge.emoji}</span>
                <p className="text-xs font-semibold text-warm-700 leading-tight">{badge.name}</p>
                <p className="text-xs text-warm-400 mt-0.5 leading-snug">{badge.description}</p>
                {isEarned && (
                  <span className="inline-block mt-1.5 text-xs text-sage-600 font-medium">✓ Earned</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {earnedCount === 0 && !loading && (
        <p className="text-center text-warm-400 text-sm mt-4">
          Start chatting and tracking your mood to earn your first badge! 🌱
        </p>
      )}
    </div>
  );
}
