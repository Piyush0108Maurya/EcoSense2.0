export const WAQI_TOKEN = import.meta.env.VITE_WAQI_TOKEN;
export const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;

// Debug: confirm the key is loaded after every dev server restart
console.log(`[Lumi API] Key loaded: ${GEMINI_KEY ? GEMINI_KEY.slice(0, 8) + '...' : '❌ MISSING — check .env'}`);

export async function askGemini(systemPrompt, userMessage, history = []) {
  // gemini-2.5-flash on v1beta — latest stable model with 15 RPM free tier
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  console.log("Lumi Spirit: Connecting via gemini-2.5-flash on v1beta...");

  const contents = [
    { role: "user", parts: [{ text: `SYSTEM_CONTEXT: ${systemPrompt}` }] },
    { role: "model", parts: [{ text: "Understood. I am Lumi, the Eco Intelligence. Ready for your request." }] }
  ];

  for (const msg of history) {
    if (msg.text && msg.role) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
  }

  contents.push({ role: "user", parts: [{ text: userMessage }] });

  const body = {
    contents,
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 600,
      topP: 0.95,
    }
  };

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    // Fetch inside its own try/catch — business-logic throws BELOW are never swallowed
    let response, data;
    try {
      response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      data = await response.json();
    } catch (networkErr) {
      if (attempt === MAX_RETRIES) throw new Error("Network error — check your connection.");
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    // ── Success ──────────────────────────────────────────────────────────────
    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    console.error(`Gemini API Detail [${response.status}]:`, data);
    const errMsg = data.error?.message || "";

    // ── 404: wrong model name or endpoint ────────────────────────────────────
    if (response.status === 404) {
      throw new Error(`MODEL_NOT_FOUND: ${errMsg}`);
    }

    // ── 429: rate limited ─────────────────────────────────────────────────────
    if (response.status === 429) {
      if (attempt < MAX_RETRIES) {
        const retryMatch = errMsg.match(/retry in (\d+(?:\.\d+)?)s/i);
        const waitMs = retryMatch
          ? Math.ceil(parseFloat(retryMatch[1])) * 1000 + 500
          : 10000 * (attempt + 1);
        console.warn(`Lumi: Rate limited. Retrying in ${waitMs / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
      // All retries exhausted — distinguish daily quota vs RPM spike
      const isDailyExhausted = errMsg.includes("free_tier") && errMsg.includes("limit: 0");
      throw new Error(isDailyExhausted ? "QUOTA_EXHAUSTED" : "RATE_LIMITED");
    }

    // ── Other API error ───────────────────────────────────────────────────────
    throw new Error(errMsg || "Failed to receive response from Lumi.");
  }
}

export async function fetchAQI(target) {
  const res = await fetch(`https://api.waqi.info/feed/${target}/?token=${WAQI_TOKEN}`);
  const json = await res.json();
  if (json.status !== "ok") throw new Error("Bad response");
  return json.data;
}
