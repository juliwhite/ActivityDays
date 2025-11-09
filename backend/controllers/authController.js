const User = require('../models/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { isValidEmail, isValidPassword } = require('../utils/validation');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long and include at least one letter and one number.'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
        
    // Hash the password using Argon2
    const hashedPassword = await argon2.hash(password);
    
    // Create a new user instance
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user' // default role
    });
    
    // Save the user to the database
    await newUser.save();
    
    const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: "User registered successfully", token, user: { id: newUser._id, email: newUser.email } });
  } catch (error) {
    console.error('Register Error', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login existing user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Authentication successful — return minimal user info (no token implemented)
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { id: user._id, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};