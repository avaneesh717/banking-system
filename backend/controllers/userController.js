const { findUserByEmail, createUser, updateUserToken, findUserByToken } = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0 || results[0].password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = uuidv4();
    updateUserToken(email, token, (err) => {
      if (err) return res.status(500).send(err);
      res.json({ token, role: results[0].role, name: results[0].name });
    });
  });
};

// New signup controller
const signup = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const token = uuidv4(); // Optional: assign token on signup or on login

    createUser({ name, email, password, role, token }, (err2) => {
      if (err2) return res.status(500).send(err2);
      res.json({ message: 'User created successfully' });
    });
  });
};

module.exports = { login, signup };
