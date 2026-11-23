const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const retryGroq = async (fn, retries = 3, baseDelay = 1000) => {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const retryable = err.status === 429 || err.status >= 500 || !err.status;
      if (!retryable) break;
      if (i < retries - 1) await sleep(baseDelay * 2 ** i);
    }
  }
  throw lastErr;
};

module.exports = retryGroq;