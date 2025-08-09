const db = require('./db');

const findUserByEmail = (email, callback) => {
  db.query("SELECT * FROM Users WHERE email = ?", [email], callback);
};

const createUser = (user, callback) => {
  const { name, email, password, role, token } = user;
  db.query("INSERT INTO Users (name, email, password, role, token) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, token], callback);
};

const updateUserToken = (email, token, callback) => {
  db.query("UPDATE Users SET token = ? WHERE email = ?", [token, email], callback);
};

const findUserByToken = (token, callback) => {
  db.query("SELECT * FROM Users WHERE token = ?", [token], callback);
};

module.exports = { findUserByEmail, createUser, updateUserToken, findUserByToken };
