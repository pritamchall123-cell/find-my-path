const {
  registerUser,
  verifyEmail,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, educationLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const user = await registerUser({ name, email, password, educationLevel });
    res.status(201).json({ message: 'Registered! Please check your email to verify your account.', user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const verify = async (req, res) => {
  try {
    const result = await verifyEmail(req.params.token);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginUser({ email, password });
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }
    const result = await googleLogin(idToken);
    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

const forgot = async (req, res) => {
  try {
    const result = await forgotPassword(req.body.email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

const reset = async (req, res) => {
  try {
    const result = await resetPassword(req.params.token, req.body.password);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { register, verify, login, googleAuth, forgot, reset };