import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';
import PasswordInput from '../components/PasswordInput';

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    educationLevel: 'college',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const res = await axiosInstance.post('/auth/google', {
        idToken: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">{t('register.title')}</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign-up failed')}
            text="signup_with"
          />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <input
          type="text"
          name="name"
          placeholder={t('register.fullName')}
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder={t('register.email')}
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-4"
        />
        <div className="mb-4">
          <PasswordInput
            name="password"
            placeholder={t('register.password')}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <select
          name="educationLevel"
          value={form.educationLevel}
          onChange={handleChange}
          className="w-full border rounded p-2 mb-4"
        >
          <option value="class10">Class 10</option>
          <option value="class12">Class 12</option>
          <option value="college">College</option>
          <option value="graduate">Graduate</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? t('register.creating') : t('register.registerButton')}
        </button>

        <p className="text-sm mt-4 text-center">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="text-blue-600 font-medium">
            {t('register.login')}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;