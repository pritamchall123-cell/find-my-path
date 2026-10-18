import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import PasswordInput from '../components/PasswordInput';

function Settings() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [accountForm, setAccountForm] = useState({
    name: storedUser.name || '',
    email: storedUser.email || '',
    phone: storedUser.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [accountMessage, setAccountMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleAccountSave = async (e) => {
    e.preventDefault();
    setSavingAccount(true);
    setAccountMessage('');
    try {
      const res = await axiosInstance.put('/user/account', accountForm);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setAccountMessage('Account updated successfully.');
    } catch (err) {
      setAccountMessage(err.response?.data?.message || 'Failed to update account');
    } finally {
      setSavingAccount(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage('');
    try {
      await axiosInstance.put('/user/password', passwordForm);
      setPasswordMessage('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPasswordMessage(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') {
      setDeleteError('Please type DELETE exactly to confirm.');
      return;
    }
    setDeleting(true);
    setDeleteError('');
    try {
      await axiosInstance.delete('/user/account');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Account Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Information</h2>
        {accountMessage && (
          <div className="bg-blue-100 text-blue-700 p-2 rounded mb-4 text-sm">{accountMessage}</div>
        )}
        <form onSubmit={handleAccountSave} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={accountForm.name}
            onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
            className="w-full border rounded p-2"
          />
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Email <span className="text-red-500">*</span> (required)
            </label>
            <input
              type="email"
              placeholder="Email"
              value={accountForm.email}
              onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mobile Number (optional)</label>
            <input
              type="tel"
              placeholder="e.g. +91 9876543210"
              value={accountForm.phone}
              onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <button
            type="submit"
            disabled={savingAccount}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {savingAccount ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        {passwordMessage && (
          <div className="bg-blue-100 text-blue-700 p-2 rounded mb-4 text-sm">{passwordMessage}</div>
        )}
        <form onSubmit={handlePasswordSave} className="space-y-3">
          <PasswordInput
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            required
          />
          <PasswordInput
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />
          <button
            type="submit"
            disabled={savingPassword}
            className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-6 rounded-lg shadow border-2 border-red-200">
        <h2 className="text-lg font-semibold mb-2 text-red-700">Danger Zone</h2>
        <p className="text-gray-600 text-sm mb-4">
          Deleting your account permanently removes your profile, roadmap, assessment history,
          resume analysis, and chat history. This cannot be undone.
        </p>

        {deleteError && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">{deleteError}</div>
        )}

        <label className="block text-sm font-medium mb-1">
          Type <span className="font-mono font-bold">DELETE</span> to confirm
        </label>
        <input
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          className="w-full border rounded p-2 mb-3"
        />
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 text-white px-5 py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Permanently Delete My Account'}
        </button>
      </div>
    </div>
  );
}

export default Settings;