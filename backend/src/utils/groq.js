const GROQ_MODELS = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Sends one request to Groq, with or without streaming
const requestGroq = async (model, prompt, temperature, stream = false, signal) => {
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
      stream,
    }),
    signal,
  });

  if (!res.ok) {
    const err = new Error(`Groq ${model} ${res.status}: ${await res.text()}`);
    err.status = res.status;
    throw err;
  }

  return res;
};

const callModel = async (model, prompt, temperature) => {
  const res = await requestGroq(model, prompt, temperature);
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

// Reads Groq's stream and passes each new piece of text to onChunk
const readStream = async (res, onChunk) => {
  const decoder = new TextDecoder();
  let buffer = '';

  for await (const bytes of res.body) {
    buffer += decoder.decode(bytes, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep the unfinished line for the next round

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;

      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;

      const json = JSON.parse(payload);
      if (json.error) throw new Error(json.error.message || 'Groq stream error');

      const piece = json.choices?.[0]?.delta?.content;
      if (piece) onChunk(piece);
    }
  }

  throw new Error('Groq stream ended early');
};

// Like generateText, but delivers the answer piece by piece
const streamText = async (prompt, temperature, onChunk, signal) => {
  let fullText = '';

  try {
    const res = await requestGroq(GROQ_MODELS[0], prompt, temperature, true, signal);
    await readStream(res, (piece) => {
      fullText += piece;
      onChunk(piece);
    });
    if (fullText) return fullText;
  } catch (err) {
    console.error('Groq streaming failed:', err.message);
    // Do not retry if text was already shown or the student left
    if (fullText || signal?.aborted) throw err;
  }

  // Fallback: get the whole answer at once
  const text = await generateText(prompt, temperature);
  onChunk(text);
  return text;
};

// Pulls the JSON out of the AI reply, even if it adds extra text around it
const extractJson = (raw) => {
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const starts = [cleaned.indexOf('['), cleaned.indexOf('{')].filter((i) => i >= 0);
  const start = starts.length ? Math.min(...starts) : -1;
  const end = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));
  return start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
};

module.exports = { generateText, streamText, extractJson };