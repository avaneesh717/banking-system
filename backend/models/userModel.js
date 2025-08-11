const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  token: String
});

const User = mongoose.model('User', userSchema);

// Keep exact same function names and structure
const findUserByEmail = (email, callback) => {
  User.findOne({ email: email })
    .then(results => callback(null, results ? [results] : []))
    .catch(err => callback(err));
};

const createUser = (user, callback) => {
  const { name, email, password, role, token } = user;
  const newUser = new User({ name, email, password, role, token });
  newUser.save()
    .then(() => callback(null))
    .catch(err => callback(err));
};

const updateUserToken = (email, token, callback) => {
  User.findOneAndUpdate({ email: email }, { token: token })
    .then(() => callback(null))
    .catch(err => callback(err));
};

const findUserByToken = (token, callback) => {
  User.findOne({ token: token })
    .then(results => callback(null, results ? [results] : []))
    .catch(err => callback(err));
};

module.exports = { findUserByEmail, createUser, updateUserToken, findUserByToken };
