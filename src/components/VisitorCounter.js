// src/components/VisitorCounter.js
import React, { useState, useEffect } from "react";
import { subscribeToVisitorCount } from "../firebase";

export default function VisitorCounter({ className = "" }) {
  const [count, setCount]       = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToVisitorCount((newCount) => {
      setCount(newCount);
      setAnimated(true);
      setTimeout(() => setAnimated(false), 600);
    });
    return () => unsubscribe();
  }, []);

  if (count === null) return null;

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`text-calm-500 font-semibold transition-all duration-300 ${animated ? "scale-110 text-calm-600" : ""}`}>
          🌐 {count.toLocaleString()}
        </span>
        <span className="text-sm text-warm-500">
          {count === 1 ? "person" : "people"} have visited Guest
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        <span className="text-xs text-green-600 font-medium">100+ active users every week</span>
      </div>
    </div>
  );
}