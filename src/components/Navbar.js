// src/components/Navbar.js
// Top navigation bar with responsive mobile menu and page links

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/",          label: "Home",      icon: "🏡" },
  { to: "/chat",      label: "Chat",      icon: "💬" },
  { to: "/resources", label: "Resources", icon: "📚" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-calm-100 shadow-soft sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌿</span>
          <span className="font-display text-xl font-semibold text-calm-700 group-hover:text-calm-500 transition-colors">
            Guest
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-1.5
                ${pathname === to
                  ? "bg-calm-100 text-calm-700"
                  : "text-warm-600 hover:bg-calm-50 hover:text-calm-600"
                }`}
            >
              <span>{icon}</span> {label}
            </Link>
          ))}
          {/* Crisis Button */}
          <a
            href="tel:988"
            className="ml-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-sm px-4 py-2 rounded-xl border border-red-200 transition-colors"
          >
            🆘 988 Crisis Line
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 rounded-xl hover:bg-calm-50 text-warm-600"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-calm-100 px-4 pb-4 animate-slide-up">
          {NAV_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl my-1 font-medium text-sm transition-colors
                ${pathname === to
                  ? "bg-calm-100 text-calm-700"
                  : "text-warm-600 hover:bg-calm-50"
                }`}
            >
              <span>{icon}</span> {label}
            </Link>
          ))}
          <a
            href="tel:988"
            className="flex items-center gap-2 bg-red-50 text-red-600 font-semibold text-sm px-3 py-3 rounded-xl border border-red-200 mt-2"
          >
            🆘 988 Crisis Line — Call Now
          </a>
        </div>
      )}
    </nav>
  );
}
