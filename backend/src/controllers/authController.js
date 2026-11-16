import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Local fallback storage for offline development
const FALLBACK_DIR = path.resolve('src/data');
const USERS_FILE = path.join(FALLBACK_DIR, 'users.json');

export const getLocalUsers = () => {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    if (!fs.existsSync(USERS_FILE)) {
      const adminSalt = bcrypt.genSaltSync(10);
      const defaultAdmin = [
        {
          _id: 'admin_velvi_001',
          name: 'Velvi Administrator',
          email: 'admin@velvinaturals.com',
          password: bcrypt.hashSync('Admin@12345', adminSalt),
          phone: '+919451155771',
          role: 'admin',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultAdmin, null, 2));
      return defaultAdmin;
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

const saveLocalUsers = (users) => {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error saving local users:', err.message);
  }
};

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  const cleanEmail = email.toLowerCase().trim();

  // 1. If MongoDB is connected, use real MongoDB
  if (mongoose.connection.readyState === 1) {
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone || '',
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
      },
    });
  }

  // 2. Fallback: local persistence
  console.log('ℹ️ Registering user in local fallback storage (MongoDB offline)...');
  const localUsers = getLocalUsers();

  if (localUsers.some((u) => u.email === cleanEmail)) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: 'usr_' + Date.now().toString(36),
    name: name.trim(),
    email: cleanEmail,
    password: hashedPassword,
    phone: phone || '',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  localUsers.push(newUser);
  saveLocalUsers(localUsers);

  const token = generateToken(newUser._id, newUser.role);

  return res.status(201).json({
    success: true,
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      token,
    },
  });
});

/**
 * @desc   Login user and return token
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const cleanEmail = email.toLowerCase().trim();

  // 1. If MongoDB is connected, use real MongoDB
  if (mongoose.connection.readyState === 1) {
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      res.status(401);
      throw new Error('Your account has been deactivated. Please contact support.');
    }

    const token = generateToken(user._id, user.role);

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
      },
    });
  }

  // 2. Fallback: local persistence
  console.log('ℹ️ Authenticating user via local fallback storage (MongoDB offline)...');
  const localUsers = getLocalUsers();
  const user = localUsers.find((u) => u.email === cleanEmail);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error('Your account has been deactivated.');
  }

  const token = generateToken(user._id, user.role);

  return res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token,
    },
  });
});

/**
 * @desc   Get current user profile
 * @route  GET /api/auth/me
 * @access Private
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

/**
 * @desc   Update user profile
 * @route  PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const user = await User.findById(req.user._id).select('+password');
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.email) user.email = req.body.email;

    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        res.status(400);
        throw new Error('Please provide your current password');
      }
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        res.status(400);
        throw new Error('Current password is incorrect');
      }
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();
    return res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  }

  // Fallback
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u._id === req.user._id);
  if (idx > -1) {
    if (req.body.name) users[idx].name = req.body.name;
    if (req.body.phone) users[idx].phone = req.body.phone;
    if (req.body.email) users[idx].email = req.body.email;
    saveLocalUsers(users);
  }

  res.json({
    success: true,
    data: users[idx] || req.user,
  });
});

/**
 * @desc   Add a new address
 * @route  POST /api/auth/address
 * @access Private
 */
export const addAddress = asyncHandler(async (req, res) => {
  res.status(201).json({
    success: true,
    data: req.body,
  });
});

/**
 * @desc   Delete an address
 * @route  DELETE /api/auth/address/:addressId
 * @access Private
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: [],
  });
});
