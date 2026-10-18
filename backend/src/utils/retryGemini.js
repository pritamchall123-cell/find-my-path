const retryGemini = async (fn, maxRetries = 5) => {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const is503 = error.message?.includes('503') || error.status === 503;
      if (!is503 || attempt === maxRetries - 1) {
        throw error;
      }
      const waitTime = 2000 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
  throw lastError;
};

module.exports = retryGemini;