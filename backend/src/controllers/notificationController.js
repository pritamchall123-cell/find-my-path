const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} = require('../services/notificationService');

const list = async (req, res) => {
  try {
    const notifications = await getMyNotifications(req.user.id);
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const markOneRead = async (req, res) => {
  try {
    const notification = await markAsRead(req.user.id, req.params.id);
    res.status(200).json({ notification });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await markAllAsRead(req.user.id);
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { list, markOneRead, markAllRead };