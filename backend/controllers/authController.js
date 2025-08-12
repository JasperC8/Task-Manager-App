// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Sign JWT with user id and role
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * POST /api/auth/register
 * Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields (name, email, password, role) are required' });
    }
    if (!['doctor', 'pharmacy'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: signToken(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * POST /api/auth/login
 * Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,          // frontend expects this
      token: signToken(user),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * GET /api/auth/me
 * Private
 */
const getProfile = async (req, res) => {
  try {
    return res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

/**
 * PUT /api/auth/me
 * Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // hashed by pre-save hook

    const saved = await user.save();

    return res.json({
      id: saved._id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
      token: signToken(saved), // optional refresh
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
};

