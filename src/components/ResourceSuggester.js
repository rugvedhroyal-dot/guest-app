// src/components/ResourceSuggester.js
// Smart resource suggester — shows relevant resources based on
// a selected topic/need. Used on both the Resources page and Chat page.

import React, { useState } from "react";

const TOPICS = [
  { id: "crisis",     label: "🆘 Crisis Support",    color: "bg-red-50 border-red-200 text-red-700" },
  { id: "addiction",  label: "💊 Addiction & Recovery", color: "bg-purple-50 border-purple-200 text-purple-700" },
  { id: "depression", label: "😔 Depression & Anxiety", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { id: "alcohol",    label: "🍺 Alcohol Use",        color: "bg-amber-50 border-amber-200 text-amber-700" },
  { id: "community",  label: "🤝 Community Support",  color: "bg-green-50 border-green-200 text-green-700" },
  { id: "youth",      label: "🧒 Youth Resources",    color: "bg-teal-50 border-teal-200 text-teal-700" },
];

const RESOURCES_BY_TOPIC = {
  crisis: [
    {
      name: "988 Suicide & Crisis Lifeline",
      description: "Free, confidential crisis support 24/7. Call or text 988.",
      contact: "Call or text: 988",
      url: "https://988lifeline.org",
      type: "Hotline",
    },
    {
      name: "Crisis Text Line",
      description: "Text with a trained crisis counselor anytime.",
      contact: "Text HOME to 741741",
      url: "https://www.crisistextline.org",
      type: "Text",
    },
    {
      name: "SAMHSA Helpline",
      description: "Mental health & substance use referrals. Free, confidential, 24/7.",
      contact: "1-800-662-4357",
      url: "https://www.samhsa.gov/find-help/national-helpline",
      type: "Hotline",
    },
  ],
  addiction: [
    {
      name: "SAMHSA National Helpline",
      description: "Substance use disorder treatment referral and info service.",
      contact: "1-800-662-4357",
      url: "https://www.samhsa.gov/find-help/national-helpline",
      type: "Hotline",
    },
    {
      name: "Narcotics Anonymous",
      description: "Fellowship and 12-step program for those recovering from addiction.",
      contact: "Find local meetings at na.org",
      url: "https://www.na.org",
      type: "Community",
    },
    {
      name: "SMART Recovery",
      description: "Science-based addiction recovery support groups and tools.",
      contact: "smartrecovery.org",
      url: "https://www.smartrecovery.org",
      type: "Program",
    },
  ],
  depression: [
    {
      name: "NAMI Helpline",
      description: "National Alliance on Mental Illness — free mental health info and support.",
      contact: "1-800-950-6264 or text NAMI to 741741",
      url: "https://www.nami.org/help",
      type: "Hotline",
    },
    {
      name: "BetterHelp",
      description: "Online therapy with licensed counselors. Sliding-scale fees available.",
      contact: "betterhelp.com",
      url: "https://www.betterhelp.com",
      type: "Therapy",
    },
    {
      name: "7 Cups",
      description: "Free online chat with trained listeners and mental wellness coaches.",
      contact: "7cups.com",
      url: "https://www.7cups.com",
      type: "Online",
    },
  ],
  alcohol: [
    {
      name: "Alcoholics Anonymous",
      description: "12-step fellowship for people with alcohol use disorder. Free meetings worldwide.",
      contact: "aa.org — find local meetings",
      url: "https://www.aa.org",
      type: "Community",
    },
    {
      name: "Al-Anon",
      description: "Support for family and friends of people with alcohol use problems.",
      contact: "al-anon.org",
      url: "https://al-anon.org",
      type: "Family",
    },
    {
      name: "NIAAA Alcohol Help",
      description: "National Institute on Alcohol Abuse — treatment navigator and info.",
      contact: "rethinkingdrinking.niaaa.nih.gov",
      url: "https://www.rethinkingdrinking.niaaa.nih.gov",
      type: "Information",
    },
  ],
  community: [
    {
      name: "211 Helpline",
      description: "Local community resources for food, housing, health, and more.",
      contact: "Dial 211 or visit 211.org",
      url: "https://www.211.org",
      type: "Community",
    },
    {
      name: "Psychology Today Therapist Finder",
      description: "Find local therapists, psychiatrists, and support groups by ZIP code.",
      contact: "psychologytoday.com/us/therapists",
      url: "https://www.psychologytoday.com/us/therapists",
      type: "Directory",
    },
    {
      name: "Open Path Collective",
      description: "Affordable therapy sessions ($30–$80) with licensed professionals.",
      contact: "openpathcollective.org",
      url: "https://openpathcollective.org",
      type: "Therapy",
    },
  ],
  youth: [
    {
      name: "Teen Line",
      description: "Teens helping teens — peer support hotline for ages 13–19.",
      contact: "1-800-852-8336 or text TEEN to 839863",
      url: "https://www.teenlineonline.org",
      type: "Youth",
    },
    {
      name: "The Trevor Project",
      description: "Crisis intervention for LGBTQ+ youth. Free, confidential, 24/7.",
      contact: "1-866-488-7386 or text START to 678-678",
      url: "https://www.thetrevorproject.org",
      type: "LGBTQ+",
    },
    {
      name: "Crisis Text Line (Youth)",
      description: "Text-based crisis support especially popular with young people.",
      contact: "Text HOME to 741741",
      url: "https://www.crisistextline.org",
      type: "Text",
    },
  ],
};

const TYPE_COLORS = {
  Hotline: "bg-red-100 text-red-700",
  Text: "bg-blue-100 text-blue-700",
  Community: "bg-green-100 text-green-700",
  Program: "bg-purple-100 text-purple-700",
  Therapy: "bg-calm-100 text-calm-700",
  Family: "bg-amber-100 text-amber-700",
  Information: "bg-warm-100 text-warm-700",
  Directory: "bg-teal-100 text-teal-700",
  Online: "bg-indigo-100 text-indigo-700",
  Youth: "bg-pink-100 text-pink-700",
  "LGBTQ+": "bg-violet-100 text-violet-700",
};

export default function ResourceSuggester() {
  const [selected, setSelected] = useState("crisis");

  const resources = RESOURCES_BY_TOPIC[selected] || [];

  return (
    <div className="space-y-5">
      {/* Topic Tabs */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setSelected(id)}
            className={`px-3 py-1.5 rounded-xl border text-sm font-medium transition-all duration-200
              ${selected === id ? color + " shadow-soft" : "bg-white border-warm-200 text-warm-600 hover:border-calm-300"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="space-y-3 animate-fade-in">
        {resources.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card flex items-start gap-4 hover:shadow-glow hover:border-calm-200 transition-all duration-200 group block"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className="font-semibold text-warm-800 group-hover:text-calm-600 transition-colors">
                  {r.name}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[r.type] || "bg-warm-100 text-warm-600"}`}>
                  {r.type}
                </span>
              </div>
              <p className="text-sm text-warm-500 mb-1.5">{r.description}</p>
              <p className="text-sm font-medium text-calm-600">📞 {r.contact}</p>
            </div>
            <svg className="w-5 h-5 text-calm-300 group-hover:text-calm-500 flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}
