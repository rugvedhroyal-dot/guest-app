// src/components/MoodTracker.js
// Daily mood logging with emoji scale and trend chart using Recharts.
// Saves to Firebase and awards badges for consistency.

import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart
} from "recharts";
import { useSession } from "../App";
import { saveMoodEntry, loadMoodHistory, saveBadge } from "../firebase";

// ── Mood Scale Definition ────────────────────────────────────────────────────
const MOODS = [
  { value: 1, emoji: "😔", label: "Struggling",  color: "#f87171" },
  { value: 2, emoji: "😕", label: "Low",          color: "#fb923c" },
  { value: 3, emoji: "😐", label: "Okay",         color: "#facc15" },
  { value: 4, emoji: "🙂", label: "Good",         color: "#86efac" },
  { value: 5, emoji: "😊", label: "Great",        color: "#4ade80" },
];

// Custom tooltip for the mood chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const mood = MOODS.find((m) => m.value === payload[0].value);
    return (
      <div className="bg-white border border-calm-100 rounded-xl px-3 py-2 shadow-card text-sm">
        <p className="text-warm-500 text-xs">{label}</p>
        <p className="font-medium text-warm-700">
          {mood?.emoji} {mood?.label}
        </p>
      </div>
    );
  }
  return null;
};

export default function MoodTracker() {
  const { sessionId } = useSession();
  const [selected, setSelected]   = useState(null);
  const [note, setNote]           = useState("");
  const [history, setHistory]     = useState([]);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);

  // ── Load mood history ────────────────────────────────────────────────────
  const fetchHistory = useCallback(() => {
    if (!sessionId) return;
    loadMoodHistory(sessionId).then((data) => {
      setHistory(data);
      // Check if user already logged today
      const today = new Date().toISOString().split("T")[0];
      const todayEntry = data.find((d) => d.date === today);
      if (todayEntry) {
        setAlreadyLogged(true);
        setSelected(todayEntry.mood);
      }
    });
  }, [sessionId]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  // ── Save mood ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!selected || saving) return;
    setSaving(true);
    try {
      await saveMoodEntry(sessionId, selected, note);

      // Award badges based on streaks / milestones
      if (history.length + 1 >= 7)  await saveBadge(sessionId, "week_streak");
      if (history.length + 1 >= 30) await saveBadge(sessionId, "month_streak");
      if (history.length === 0)     await saveBadge(sessionId, "first_mood");

      setSaved(true);
      setAlreadyLogged(true);
      setNote("");
      fetchHistory();
    } catch (err) {
      console.error("Save mood error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── Chart data formatting ─────────────────────────────────────────────────
  const chartData = history.slice(-14).map((entry) => ({
    date: entry.date ? entry.date.slice(5) : "",   // "MM-DD"
    mood: entry.mood,
  }));

  const avgMood = history.length
    ? (history.reduce((s, h) => s + h.mood, 0) / history.length).toFixed(1)
    : null;
  const currentMoodObj = selected ? MOODS.find((m) => m.value === selected) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Mood Input */}
      <div className="card">
        <h3 className="section-title">🌡️ How are you feeling today?</h3>
        {alreadyLogged && !saved ? (
          <p className="text-sage-600 text-sm mb-3">You've logged your mood today. Come back tomorrow!</p>
        ) : saved ? (
          <div className="text-center py-4 animate-fade-in">
            <p className="text-4xl mb-2">{currentMoodObj?.emoji}</p>
            <p className="text-sage-600 font-medium">Mood logged — {currentMoodObj?.label}</p>
            <p className="text-warm-400 text-sm mt-1">Thanks for checking in. 💙</p>
          </div>
        ) : (
          <>
            {/* Emoji selector */}
            <div className="flex justify-center gap-4 my-4">
              {MOODS.map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => setSelected(value)}
                  className={`mood-btn flex flex-col items-center gap-1 ${selected === value ? "selected" : ""}`}
                  title={label}
                  aria-label={label}
                >
                  <span className="text-3xl">{emoji}</span>
                  <span className="text-xs text-warm-500 hidden sm:block">{label}</span>
                </button>
              ))}
            </div>

            {/* Optional note */}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)…"
              rows={2}
              className="input-field mt-2 resize-none"
            />

            <button
              onClick={handleSave}
              disabled={!selected || saving}
              className="btn-primary w-full mt-3 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Log My Mood"}
            </button>
          </>
        )}
      </div>

      {/* Trend Chart */}
      {chartData.length > 1 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">📈 Mood Trend</h3>
            {avgMood && (
              <div className="text-right">
                <p className="text-xs text-warm-400">14-day avg</p>
                <p className="text-lg font-semibold text-calm-600">
                  {MOODS.find((m) => m.value === Math.round(avgMood))?.emoji} {avgMood}
                </p>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0c82ed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0c82ed" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0efff" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#0c82ed"
                strokeWidth={2.5}
                fill="url(#moodGradient)"
                dot={{ fill: "#0c82ed", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-warm-400 text-center mt-2">Last 14 days</p>
        </div>
      )}

      {/* Empty state */}
      {history.length === 0 && (
        <div className="text-center text-warm-400 text-sm py-4">
          Start logging your mood daily to see trends over time 📊
        </div>
      )}
    </div>
  );
}
