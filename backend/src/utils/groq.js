const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const callModel = async (model, prompt, temperature) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
    }),
  });

  if (!res.ok) {
    const err = new Error(`Groq ${model} ${res.status}: ${await res.text()}`);
    err.status = res.status;
    throw err;
  }

  const data = await res.json();
  return data.choices[0].message.content;
};

const callWithRetry = async (model, prompt, temperature, retries = 3) => {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await callModel(model, prompt, temperature);
    } catch (err) {
      lastErr = err;
      const retryable = err.status === 429 || err.status >= 500 || !err.status;
      if (!retryable) break;
      if (i < retries - 1) await sleep(1000 * 2 ** i); // wait 1s, then 2s
    }
  }
  throw lastErr;
};

// Main function used by all services
const generateText = async (prompt, temperature = 0.4) => {
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not set');
    const e = new Error('AI service is not configured.');
    e.statusCode = 500;
    throw e;
  }

  for (const model of GROQ_MODELS) {
    try {
      return await callWithRetry(model, prompt, temperature);
    } catch (err) {
      console.error(`Groq model ${model} failed:`, err.message);
    }
  }

  const e = new Error('AI is busy right now, please try again in a minute.');
  e.statusCode = 503;
  throw e;
};

// Pulls the JSON out of the AI reply, even if it adds extra text around it
const extractJson = (raw) => {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const starts = [cleaned.indexOf('['), cleaned.indexOf('{')].filter((i) => i >= 0);
  const start = starts.length ? Math.min(...starts) : -1;
  const end = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
};

module.exports = { generateText, extractJson };