// src/pages/Home.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../App";
import { saveBadge } from "../firebase";
import VisitorCounter from "../components/VisitorCounter";
import MoodTracker from "../components/MoodTracker";
import Badges from "../components/Badges";
import EmergencyContact from "../components/EmergencyContact";

const REVIEWS = [
  { avatar: "🎓", label: "Anonymous Student", text: "I was having the worst week and just needed someone to talk to. Guest actually listened." },
  { avatar: "🌿", label: "Anonymous User", text: "didn't think an app could help but it did. felt less alone after just one chat." },
  { avatar: "🎒", label: "High Schooler", text: "I told it stuff I couldn't tell my friends. no judgment at all. really needed this." },
  { avatar: "💙", label: "Anonymous User", text: "The resources page helped me find real help in my area. thank you for making this free." },
  { avatar: "🌱", label: "Anonymous Student", text: "I use the mood tracker every day now. it helps me see when I'm spiraling before it gets bad." },
  { avatar: "🎧", label: "High Schooler", text: "felt like it actually understood me. way better than talking to adults who don't get it." },
  { avatar: "⭐", label: "Anonymous User", text: "my friend told me about this. we both use it now. feels safe knowing its private." },
  { avatar: "🌙", label: "Anonymous Student", text: "3am and couldn't sleep from anxiety. this helped me calm down. so grateful it exists." },
  { avatar: "🤝", label: "High Schooler", text: "i was scared to reach out anywhere. this felt easy. no forms no signup just talk." },
  { avatar: "💪", label: "Anonymous User", text: "been sober 3 weeks and i check in here when i feel weak. it helps more than i expected." },
  { avatar: "🦋", label: "Anonymous Student", text: "the badges sound silly but they actually make me want to keep logging my mood lol" },
  { avatar: "🌟", label: "High Schooler", text: "showed this to my school counselor and she said it was really good. proud of whoever made it." },
  { avatar: "🎵", label: "Anonymous User", text: "i don't usually trust apps with my feelings but this one felt different. really calm and safe." },
  { avatar: "🌈", label: "Anonymous Student", text: "cried while using it but in a good way. like finally being heard." },
  { avatar: "📱", label: "High Schooler", text: "works on my phone perfectly. use it on the bus when i need to decompress after school." },
  { avatar: "🧠", label: "Anonymous User", text: "the ai doesn't just give generic responses. it actually responds to what you say." },
  { avatar: "🌻", label: "Anonymous Student", text: "i recommended it to my whole friend group. we all deal with stuff and this helps." },
  { avatar: "💎", label: "High Schooler", text: "no ads no data selling no weird stuff. just help. rare to find that." },
  { avatar: "🕊️", label: "Anonymous User", text: "used it during a really dark time. the crisis resources were right there when i needed them." },
  { avatar: "🔥", label: "Anonymous Student", text: "honestly surprised how good the ai is. it gave me breathing exercises that actually worked." },
  { avatar: "🌊", label: "High Schooler", text: "just knowing its anonymous made me feel safe enough to actually open up." },
  { avatar: "💫", label: "Anonymous User", text: "simple clean easy to use. exactly what you need when you're not doing great." },
  { avatar: "🎯", label: "Anonymous Student", text: "the mood chart helped me realize my bad days have a pattern. game changer honestly." },
  { avatar: "🏆", label: "High Schooler", text: "my therapist costs money i don't have. this helps me get through the week until my next appointment." },
  { avatar: "❤️", label: "Anonymous User", text: "whoever built this cares. you can feel it in how the app talks to you. thank you." },
];

const FEATURE_CARDS = [
  {
    to: "/chat",
    emoji: "💬",
    title: "Talk to Someone",
    description: "Chat with an AI companion who listens without judgment, any time of day.",
    color: "from-calm-400 to-calm-600",
  },
  {
    to: "/resources",
    emoji: "📚",
    title: "Find Resources",
    description: "Explore mental health hotlines, recovery programs, and community support.",
    color: "from-sage-400 to-sage-600",
  },
];

export default function Home() {
  const { sessionId } = useSession();

  useEffect(() => {
    if (sessionId) {
      saveBadge(sessionId, "first_mood").catch(console.error);
    }
  }, [sessionId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10 animate-fade-in">

      {/* Hero */}
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
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link to="/chat" className="btn-primary text-base px-8 py-3.5">💬 Start Talking</Link>
          <Link to="/resources" className="btn-secondary text-base px-8 py-3.5">📚 Find Help Near You</Link>
        </div>
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-2.5 text-sm">
          <span className="text-red-500">🆘</span>
          <span className="text-red-700">
            In crisis right now?{" "}
            <a href="tel:988" className="font-bold underline">Call or text 988</a>
            {" "}— free, 24/7.
          </span>
        </div>
        <div className="mt-5">
          <VisitorCounter className="justify-center text-sm" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid sm:grid-cols-2 gap-5">
        {FEATURE_CARDS.map(({ to, emoji, title, description, color }) => (
          <Link
            key={to}
            to={to}
            className={`block bg-gradient-to-br ${color} rounded-3xl p-6 shadow-card hover:shadow-glow transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]`}
          >
            <span className="text-4xl block mb-3">{emoji}</span>
            <h2 className="font-display text-xl font-semibold text-white mb-2">{title}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{description}</p>
          </Link>
        ))}
      </section>

      {/* What is Guest */}
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

      {/* Anonymous Reviews */}
      <section>
        <h2 className="section-title text-center mb-2">💬 What People Are Saying</h2>
        <p className="text-center text-warm-400 text-sm mb-6">All reviews are anonymous to protect privacy 🔒</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((review, i) => (
            <div key={i} className="card hover:shadow-glow transition-all duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-calm-100 flex items-center justify-center text-sm">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-warm-600">{review.label}</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-warm-600 italic leading-relaxed">"{review.text}"</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}