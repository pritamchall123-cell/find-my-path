const Notification = require('../models/Notification');

const createNotification = async (userId, message, type = 'general') => {
  const notification = await Notification.create({ user: userId, message, type });
  return notification;
};

const getMyNotifications = async (userId) => {
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
  return notifications;
};

const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
  return notification;
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};

module.exports = { createNotification, getMyNotifications, markAsRead, markAllAsRead };