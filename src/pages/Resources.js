// src/pages/Resources.js
// Mental health and community resources page with categorized support links
// Awards "resources_explored" badge on visit

import React, { useEffect } from "react";
import { useSession } from "../App";
import { saveBadge } from "../firebase";
import ResourceSuggester from "../components/ResourceSuggester";

export default function Resources() {
  const { sessionId } = useSession();

  // Award badge when user visits resources
  useEffect(() => {
    if (sessionId) {
      saveBadge(sessionId, "resources_explored").catch(console.error);
    }
  }, [sessionId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
          📚
        </div>
        <h1 className="font-display text-3xl font-bold text-warm-800 mb-2">
          Resources & Support
        </h1>
        <p className="text-warm-500 text-base max-w-lg mx-auto">
          You don't have to figure this out alone. Here are trusted resources for mental health, addiction recovery, and community support.
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="crisis-banner mb-8">
        <p className="font-semibold mb-1 text-red-700">🆘 If you're in crisis right now:</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="tel:988" className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-700 transition-colors">
            📞 Call / Text 988
          </a>
          <div className="flex items-center text-red-700">
            <span className="font-medium">Text HOME to 741741</span>
            <span className="text-red-400 ml-2">(Crisis Text Line)</span>
          </div>
          <a href="tel:911" className="text-red-700 font-medium hover:underline">
            Call 911 for emergencies
          </a>
        </div>
      </div>

      {/* Categorized Resources */}
      <ResourceSuggester />

      {/* Additional Info Section */}
      <div className="mt-10 grid sm:grid-cols-2 gap-5">
        {/* About Professional Help */}
        <div className="card">
          <h3 className="font-display text-lg text-warm-800 mb-3">👩‍⚕️ Finding a Therapist</h3>
          <p className="text-sm text-warm-500 leading-relaxed mb-3">
            Therapy can be life-changing — and more accessible than you might think. Options include:
          </p>
          <ul className="text-sm text-warm-500 space-y-2">
            <li>• <strong>Community mental health centers</strong> — often free or sliding scale</li>
            <li>• <strong>Open Path Collective</strong> — $30–$80 sessions</li>
            <li>• <strong>BetterHelp / Talkspace</strong> — online therapy</li>
            <li>• <strong>Insurance directory</strong> — use your insurance's provider search</li>
            <li>• <strong>FQHC clinics</strong> — federally funded, income-based pricing</li>
          </ul>
        </div>

        {/* About Recovery */}
        <div className="card">
          <h3 className="font-display text-lg text-warm-800 mb-3">🌱 About Recovery</h3>
          <p className="text-sm text-warm-500 leading-relaxed mb-3">
            Recovery from addiction or mental health challenges is a journey, not a destination.
          </p>
          <ul className="text-sm text-warm-500 space-y-2">
            <li>• Recovery looks different for everyone</li>
            <li>• Setbacks are part of the process — they don't erase your progress</li>
            <li>• Asking for help is a sign of strength</li>
            <li>• Community and connection are powerful healing tools</li>
            <li>• Small steps count — every day you try matters</li>
          </ul>
        </div>
      </div>

      {/* Community Note */}
      <div className="mt-8 bg-calm-50 border border-calm-100 rounded-3xl p-6 text-center">
        <p className="font-display text-lg text-warm-700 mb-2">
          Know a resource that should be here?
        </p>
        <p className="text-warm-400 text-sm mb-4">
          Guest is a community-supported app. If you know of a local or national resource that should be listed, we'd love to add it.
        </p>
        <a
          href="mailto:hello@guestapp.org"
          className="btn-ghost text-sm inline-block"
        >
          📧 Suggest a Resource
        </a>
      </div>
    </div>
  );
}
