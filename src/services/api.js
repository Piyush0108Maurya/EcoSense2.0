export const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;
export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

export async function askGemini(systemPrompt, userMessage, history = []) {
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_KEY}`;

  const contents = [];

  // Add conversation history for chatbot continuity
  for (const msg of history) {
    contents.push({
      role: msg.role,
      parts: [{ text: msg.text }]
    });
  }

  contents.push({ role: "user", parts: [{ text: userMessage }] });

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: contents,
    generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
  };

  // Retry logic with exponential backoff for rate limits
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    const status = response.status;
    if (status === 429 && attempt < MAX_RETRIES) {
      // Wait with exponential backoff: 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt + 1) * 1000));
      continue;
    }

    const err = await response.json().catch(() => ({}));
    if (status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    throw new Error(err?.error?.message || `Gemini API error (${status})`);
  }
}

export async function fetchAQI(target) {
  const res = await fetch(`https://api.waqi.info/feed/${target}/?token=${WAQI_TOKEN}`);
  const json = await res.json();
  if (json.status !== "ok") throw new Error("Bad response");
  return json.data;
}
