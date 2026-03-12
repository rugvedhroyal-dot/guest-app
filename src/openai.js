// src/openai.js
// Groq API integration (free)

const CRISIS_PHRASES = [
  "want to die","kill myself","end my life","suicide","suicidal",
  "don't want to live","no reason to live","better off dead",
  "end it all","hurt myself","self harm","overdose",
  "not worth living","want to disappear","can't go on","give up on life",
];

export const detectCrisis = (message) => {
  const lower = message.toLowerCase();
  return CRISIS_PHRASES.some((phrase) => lower.includes(phrase));
};

const SYSTEM_PROMPT = `You are a compassionate, non-judgmental support companion for the Guest app — a safe space for people struggling with addiction, depression, alcohol use, and difficult emotions. Listen with empathy and warmth. Keep responses concise (2–4 sentences). If someone expresses suicidal thoughts, guide them to the 988 Suicide & Crisis Lifeline (call or text 988).`;

export const getAIResponse = async (messages) => {
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 400,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "I'm here with you. Tell me more.";

  } catch (error) {
    console.error("Groq error:", error);
    return "I'm having trouble connecting. Please call or text 988 if you need immediate support.";
  }
};

export const getCrisisResponse = () => {
  return `I hear you, and you matter.\n\n• **988 Lifeline** — call or text **988**\n• **Crisis Text Line** — text **HOME** to **741741**\n• **Emergency** — call **911**\n\nYou don't have to face this alone.`;
};