const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

function createToken(user) {
  return jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    city: user.city,
    location: user.location,
    createdAt: user.createdAt
  };
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, city, location } = req.body;

    if (!name || !email || !password || !city || !location) {
      return res.status(400).json({ message: 'Name, email, password, city, and location are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      city,
      location: {
        type: 'Point',
        coordinates: [Number(location.lng), Number(location.lat)]
      }
    });

    return res.status(201).json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({ token: createToken(user), user: serializeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sign in' });
  }
});

module.exports = router;