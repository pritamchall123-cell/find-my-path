const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Roadmap = require('../models/Roadmap');
const AssessmentResponse = require('../models/AssessmentResponse');
const Conversation = require('../models/Conversation');
const Resume = require('../models/Resume');
const Notification = require('../models/Notification');

const updateAccount = async (userId, { name, email, phone }) => {
  if (!email || !email.trim()) {
    const error = new Error('Email is required');
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({ email, _id: { $ne: userId } });
  if (existing) {
    const error = new Error('That email is already in use');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { ...(name && { name }), email, phone: phone || null },
    { new: true, runValidators: true }
  );

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    educationLevel: user.educationLevel,
    isVerified: user.isVerified,
  };
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: 'Password updated successfully' };
};

const deleteAccount = async (userId) => {
  await Promise.all([
    Profile.deleteMany({ user: userId }),
    Roadmap.deleteMany({ user: userId }),
    AssessmentResponse.deleteMany({ user: userId }),
    Conversation.deleteMany({ user: userId }),
    Resume.deleteMany({ user: userId }),
    Notification.deleteMany({ user: userId }),
  ]);

  await User.findByIdAndDelete(userId);

  return { message: 'Account deleted successfully' };
};

module.exports = { updateAccount, changePassword, deleteAccount };