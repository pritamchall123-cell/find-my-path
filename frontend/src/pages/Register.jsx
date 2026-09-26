import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Register() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6">Create your FindMyPath account</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-4"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border rounded p-2 mb-4"
        />
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
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;