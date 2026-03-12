// src/components/EmergencyContact.js
// Emergency contact system — prompts the user for a trusted contact's email,
// saves it to Firebase, and provides optional notification guidance.

import React, { useState, useEffect } from "react";
import { useSession } from "../App";
import { saveEmergencyContact, getEmergencyContact } from "../firebase";

export default function EmergencyContact({ onClose, compact = false }) {
  const { sessionId }   = useSession();
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Load existing contact on mount
  useEffect(() => {
    if (!sessionId) return;
    getEmergencyContact(sessionId).then((contact) => {
      if (contact) {
        setExisting(contact);
        setName(contact.name || "");
        setEmail(contact.email || "");
        setSaved(true);
      }
    });
  }, [sessionId]);

  const validateEmail = (e) => /\S+@\S+\.\S+/.test(e);

  const handleSave = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await saveEmergencyContact(sessionId, email, name);
      setSaved(true);
      setExisting({ name, email });
    } catch (err) {
      setError("Couldn't save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Compact mode (used in profile/settings sidebar) ──────────────────────
  if (compact) {
    return (
      <div className="card">
        <h3 className="font-display text-lg text-warm-800 mb-3">🤝 Trusted Contact</h3>
        {saved ? (
          <div>
            <p className="text-sage-600 text-sm font-medium mb-1">✓ Contact saved</p>
            <p className="text-warm-600 text-sm">{existing?.name} — {existing?.email}</p>
            <button onClick={() => { setSaved(false); setExisting(null); }} className="text-calm-500 text-xs mt-2 underline">
              Update contact
            </button>
          </div>
        ) : (
          <ContactForm
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            error={error} loading={loading}
            onSave={handleSave}
          />
        )}
      </div>
    );
  }

  // ── Full modal mode (shown after crisis detection) ────────────────────────
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-lg text-warm-800 font-semibold">
            💛 Let someone know you need support
          </h3>
          <p className="text-warm-500 text-sm mt-0.5">
            Add a trusted person's email. We'll show you how to reach out.
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-warm-400 hover:text-warm-600 ml-2" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {saved ? (
        <div className="text-center py-2">
          <p className="text-sage-600 font-semibold mb-1">✅ Contact saved!</p>
          <p className="text-warm-600 text-sm mb-3">
            Please reach out to <strong>{existing?.name || existing?.email}</strong> and let them know you're going through a hard time. You don't have to face this alone.
          </p>
          <div className="bg-white rounded-xl p-3 border border-amber-200 text-sm text-warm-600 text-left">
            <p className="font-medium text-warm-700 mb-1">💌 Suggested message to send them:</p>
            <p className="italic text-warm-500">
              "Hey, I've been struggling a bit lately and I could use some support. Can we talk soon?"
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="btn-ghost mt-4 text-sm">
              Return to Chat
            </button>
          )}
        </div>
      ) : (
        <ContactForm
          name={name} setName={setName}
          email={email} setEmail={setEmail}
          error={error} loading={loading}
          onSave={handleSave}
          onSkip={onClose}
        />
      )}
    </div>
  );
}

// ── Reusable form subcomponent ────────────────────────────────────────────────
function ContactForm({ name, setName, email, setEmail, error, loading, onSave, onSkip }) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Their name (optional)"
        className="input-field"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Their email address"
        className="input-field"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={loading || !email}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save Contact"}
        </button>
        {onSkip && (
          <button onClick={onSkip} className="btn-ghost flex-1 text-sm">
            Skip for now
          </button>
        )}
      </div>
      <p className="text-xs text-warm-400 text-center">
        We don't automatically email anyone. This contact info is only for you.
      </p>
    </div>
  );
}
