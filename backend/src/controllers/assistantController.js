const {
  sendMessage,
  streamMessage,
  getHistory,
  clearHistory,
} = require('../services/assistantService');

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const reply = await sendMessage(req.user.id, message);
    res.status(200).json({ reply });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const streamChat = async (req, res) => {
  const { message } = req.body;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // Stop the Groq request if the connection closes early
  const controller = new AbortController();
  res.on('close', () => {
    if (!res.writableEnded) controller.abort();
  });

  const sendChunk = (piece) => {
    if (!res.headersSent) {
      res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      });
    }
    res.write(piece);
  };

  try {
    await streamMessage(req.user.id, message, sendChunk, controller.signal);
    res.end();
  } catch (error) {
    console.error('Stream chat failed:', error.message);
    if (res.headersSent) return res.destroy(); // tells the browser it was cut off
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const history = async (req, res) => {
  try {
    const messages = await getHistory(req.user.id);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const clear = async (req, res) => {
  try {
    await clearHistory(req.user.id);
    res.status(200).json({ message: 'Chat cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { chat, streamChat, history, clear };