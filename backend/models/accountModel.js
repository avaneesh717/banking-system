const db = require('./db');

const getTransactionsByUserId = (userId, callback) => {
  db.query("SELECT id, user_id, type, amount, created_at FROM Accounts WHERE user_id = ? ORDER BY created_at DESC", [userId], callback);
};

const createTransaction = (userId, type, amount, callback) => {
  console.log("DB Insert:", { userId, type, amount });  // Debug log before insert
  db.query(
    "INSERT INTO Accounts (user_id, type, amount) VALUES (?, ?, ?)",
    [userId, type, amount],
    (err, results) => {
      if (err) {
        console.error("SQL Insert Error:", err);  // Log detailed SQL error
        return callback(err);
      }
      callback(null, results);
    }
  );
};

const getBalance = (userId, callback) => {
  db.query(`
    SELECT 
      SUM(CASE WHEN type = 'deposit' THEN amount ELSE -amount END) AS balance
    FROM Accounts
    WHERE user_id = ?
  `, [userId], callback);
};

const getAllCustomers = (callback) => {
  db.query("SELECT * FROM Users WHERE role = 'customer'", callback);
};

module.exports = { getTransactionsByUserId, createTransaction, getBalance, getAllCustomers };
