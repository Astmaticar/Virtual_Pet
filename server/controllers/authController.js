const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const resetRequestTimes = new Map();
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!username || username.length < 2) {
      return res.status(400).json({ success: false, message: 'Username must be at least 2 characters long' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with that email or username already exists' });
    }

    const user = await User.create({ username, email, password });
    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const genericMessage = 'Ako email postoji u sustavu, poslan je link za reset lozinke';

  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const requestKey = `${req.ip}:${email}`;
    const lastRequestAt = resetRequestTimes.get(requestKey);
    const elapsed = lastRequestAt ? Date.now() - lastRequestAt : RESET_REQUEST_COOLDOWN_MS;

    if (elapsed < RESET_REQUEST_COOLDOWN_MS) {
      const retryAfterSeconds = Math.ceil((RESET_REQUEST_COOLDOWN_MS - elapsed) / 1000);
      return res.status(429).json({
        success: false,
        message: 'Novi zahtjev možete poslati za jednu minutu.',
        retryAfterSeconds,
      });
    }

    resetRequestTimes.set(requestKey, Date.now());
    const user = email ? await User.findOne({ email }) : null;

    if (!user) {
      return res.status(200).json({ success: true, message: genericMessage });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset lozinke za Virtual Pet',
        text: `Za postavljanje nove lozinke otvori ovaj link: ${resetUrl}`,
        html: `<p>Za postavljanje nove lozinke klikni na link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>Link vrijedi 1 sat.</p>`,
        resetUrl,
      });
    } catch (emailError) {
      console.error('Forgot password email delivery error:', emailError);
    }

    return res.status(200).json({ success: true, message: genericMessage });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Link za reset lozinke je nevažeći ili je istekao' });
    }

    const isSamePassword = await user.comparePassword(password);
    if (isSamePassword) {
      return res.status(400).json({ success: false, message: 'Nova lozinka mora biti drugačija od stare lozinke' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ success: true, message: 'Lozinka je uspješno promijenjena' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
