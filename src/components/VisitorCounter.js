// src/components/VisitorCounter.js
// Real-time visitor counter — subscribes to Firestore for live updates
// and displays a formatted count with animation.

import React, { useState, useEffect } from "react";
import { subscribeToVisitorCount } from "../firebase";

export default function VisitorCounter({ className = "" }) {
  const [count, setCount]       = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Subscribe to real-time Firestore updates
    const unsubscribe = subscribeToVisitorCount((newCount) => {
      setCount(newCount);
      // Trigger flash animation on update
      setAnimated(true);
      setTimeout(() => setAnimated(false), 600);
    });
    return () => unsubscribe();
  }, []);

  if (count === null) return null;

  return (
    <div className={`flex items-center gap-2 text-warm-500 ${className}`}>
      <span className={`text-calm-500 font-semibold transition-all duration-300 ${animated ? "scale-110 text-calm-600" : ""}`}>
        🌐 {count.toLocaleString()}
      </span>
      <span className="text-sm">
        {count === 1 ? "person" : "people"} have visited Guest
      </span>
    </div>
  );
}
