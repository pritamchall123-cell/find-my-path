const { sendMessage, getHistory } = require('../services/assistantService');

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const reply = await sendMessage(req.user.id, message);
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
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

module.exports = { chat, history };