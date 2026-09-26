const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async ({ name, email, password, educationLevel }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already registered');
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    educationLevel,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    educationLevel: user.educationLevel,
  };
};

const loginUser = async ({email, password}) =>{
    const user = await User.findOne({email});
    if(!user){
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            educationLevel: user.educationLevel,
        },
    };
};

module.exports = { registerUser, loginUser };