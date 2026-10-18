const { updateAccount, changePassword, deleteAccount } = require('../services/userService');

const update = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await updateAccount(req.user.id, { name, email });
    res.status(200).json({ message: 'Account updated', user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const changePass = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    const result = await changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    const result = await deleteAccount(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { update, changePass, remove };