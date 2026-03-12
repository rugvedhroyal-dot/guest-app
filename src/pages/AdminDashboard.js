// src/pages/AdminDashboard.js
// Admin dashboard — shows visitor counts, chat volume, mood trends,
// and emergency trigger logs. Protected by AdminGuard in App.js.

import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  subscribeToVisitorCount,
  loadRecentChats,
  loadAllMoods,
  loadEmergencyTriggers,
} from "../firebase";

// ── Color palette for charts ───────────────────────────────────────────────
const CHART_COLORS = ["#0c82ed", "#449b58", "#facc15", "#f87171", "#818cf8"];

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ emoji, label, value, sub, color = "text-calm-600" }) {
  return (
    <div className="card text-center">
      <p className="text-3xl mb-1">{emoji}</p>
      <p className={`font-display text-3xl font-bold ${color}`}>{value ?? "—"}</p>
      <p className="text-warm-600 font-medium text-sm">{label}</p>
      {sub && <p className="text-warm-400 text-xs mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [visitors,   setVisitors]   = useState(null);
  const [chats,      setChats]      = useState([]);
  const [moods,      setMoods]      = useState([]);
  const [triggers,   setTriggers]   = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    // Real-time visitor count
    const unsub = subscribeToVisitorCount(setVisitors);

    // Load all data
    Promise.all([
      loadRecentChats(200),
      loadAllMoods(200),
      loadEmergencyTriggers(),
    ]).then(([c, m, t]) => {
      setChats(c);
      setMoods(m);
      setTriggers(t);
      setLoading(false);
    }).catch((err) => {
      console.error("Admin load error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ── Derived analytics ────────────────────────────────────────────────────
  // Unique sessions
  const uniqueSessions = new Set(chats.map((c) => c.sessionId)).size;

  // Messages per day (last 7 days)
  const msgByDay = (() => {
    const counts = {};
    chats.forEach((c) => {
      if (!c.timestamp?.seconds) return;
      const date = new Date(c.timestamp.seconds * 1000).toISOString().split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, count]) => ({ date: date.slice(5), count }));
  })();

  // Mood distribution
  const moodDist = [1,2,3,4,5].map((v) => ({
    name: ["😔","😕","😐","🙂","😊"][v - 1],
    count: moods.filter((m) => m.mood === v).length,
  }));

  // Avg mood over last 14 days
  const moodByDay = (() => {
    const byDate = {};
    moods.forEach((m) => {
      if (!m.date) return;
      if (!byDate[m.date]) byDate[m.date] = [];
      byDate[m.date].push(m.mood);
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, vals]) => ({
        date: date.slice(5),
        avg: parseFloat((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2)),
      }));
  })();

  // Role breakdown
  const userMsgs = chats.filter((c) => c.role === "user").length;
  const aiMsgs   = chats.filter((c) => c.role === "assistant").length;
  const rolePie  = [
    { name: "User", value: userMsgs },
    { name: "AI",   value: aiMsgs },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-10 h-10 border-4 border-calm-200 border-t-calm-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-500">Loading dashboard data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-warm-800 mb-1">📊 Admin Dashboard</h1>
        <p className="text-warm-400 text-sm">Real-time insights for Guest community health.</p>
      </div>

      {/* ── Overview Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard emoji="🌐" label="Total Visitors"  value={visitors?.toLocaleString()} color="text-calm-600" />
        <StatCard emoji="👥" label="Unique Sessions" value={uniqueSessions} color="text-sage-600" />
        <StatCard emoji="💬" label="Total Messages"  value={chats.length} color="text-warm-600" />
        <StatCard emoji="⚠️" label="Crisis Triggers" value={triggers.length} color="text-red-500" />
      </div>

      {/* ── Messages Per Day Chart ───────────────────────────────────────── */}
      <div className="card">
        <h2 className="font-display text-xl text-warm-800 mb-4">Messages per Day (Last 7 Days)</h2>
        {msgByDay.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={msgByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0efff" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <YAxis tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #b9dcff", fontSize: "13px" }}
              />
              <Bar dataKey="count" fill="#0c82ed" radius={[6, 6, 0, 0]} name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-warm-400 text-sm text-center py-8">No message data yet.</p>
        )}
      </div>

      {/* ── Average Mood Trend ───────────────────────────────────────────── */}
      <div className="card">
        <h2 className="font-display text-xl text-warm-800 mb-4">Community Mood Trend (Last 14 Days)</h2>
        {moodByDay.length > 1 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0efff" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <YAxis domain={[1, 5]} ticks={[1,2,3,4,5]} tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #cae8d0", fontSize: "13px" }}
                formatter={(v) => [v, "Avg Mood"]}
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#449b58"
                strokeWidth={2.5}
                dot={{ fill: "#449b58", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-warm-400 text-sm text-center py-8">Not enough mood data yet.</p>
        )}
      </div>

      {/* ── Mood Distribution + Role Pie ─────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Mood Distribution Bar */}
        <div className="card">
          <h2 className="font-display text-lg text-warm-800 mb-4">Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={moodDist} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 18 }} />
              <YAxis tick={{ fontSize: 11, fill: "#8f8f7d" }} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", fontSize: "13px" }}
                formatter={(v) => [v, "Logs"]}
              />
              <Bar dataKey="count" radius={[6,6,0,0]}>
                {moodDist.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Message Role Pie */}
        <div className="card">
          <h2 className="font-display text-lg text-warm-800 mb-4">Message Roles</h2>
          {chats.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={rolePie}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {rolePie.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontSize: 12, color: "#5e5e51" }}>{v}</span>} />
                <Tooltip formatter={(v) => [v, "messages"]} contentStyle={{ borderRadius: "12px", fontSize: "13px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-warm-400 text-sm text-center py-8">No chat data yet.</p>
          )}
        </div>
      </div>

      {/* ── Emergency Triggers Log ───────────────────────────────────────── */}
      <div className="card">
        <h2 className="font-display text-xl text-warm-800 mb-4">⚠️ Recent Crisis Triggers</h2>
        {triggers.length === 0 ? (
          <p className="text-warm-400 text-sm py-4 text-center">No crisis triggers recorded. 💙</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-calm-100">
                  <th className="text-left py-2 text-warm-500 font-medium">Session</th>
                  <th className="text-left py-2 text-warm-500 font-medium">Trigger Phrase</th>
                  <th className="text-left py-2 text-warm-500 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {triggers.map((t) => (
                  <tr key={t.id} className="border-b border-calm-50 hover:bg-red-50 transition-colors">
                    <td className="py-2 text-warm-400 font-mono text-xs truncate max-w-[120px]">
                      {t.sessionId?.slice(0, 12)}…
                    </td>
                    <td className="py-2 text-red-600">{t.triggerPhrase?.slice(0, 60)}</td>
                    <td className="py-2 text-warm-400 text-xs whitespace-nowrap">
                      {t.timestamp?.seconds
                        ? new Date(t.timestamp.seconds * 1000).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Recent Chats Preview ─────────────────────────────────────────── */}
      <div className="card">
        <h2 className="font-display text-xl text-warm-800 mb-4">💬 Recent Messages</h2>
        {chats.length === 0 ? (
          <p className="text-warm-400 text-sm py-4 text-center">No chats recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {chats.slice(0, 20).map((c) => (
              <div
                key={c.id}
                className={`flex items-start gap-3 px-3 py-2 rounded-xl text-sm
                  ${c.role === "user" ? "bg-calm-50" : "bg-sage-50"}`}
              >
                <span className="flex-shrink-0 font-medium text-xs text-warm-400 w-16 pt-0.5">
                  {c.role === "user" ? "👤 User" : "🤖 AI"}
                </span>
                <p className="text-warm-600 flex-1 truncate">{c.content}</p>
                <span className="text-xs text-warm-300 flex-shrink-0">
                  {c.timestamp?.seconds
                    ? new Date(c.timestamp.seconds * 1000).toLocaleTimeString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
