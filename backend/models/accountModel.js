const mongoose = require('mongoose');

// Account Schema
const accountSchema = new mongoose.Schema({
  user_id: String,
  type: String,
  amount: Number,
  created_at: { type: Date, default: Date.now }
});

const Account = mongoose.model('Account', accountSchema);

// Keep exact same function names and structure
const getTransactionsByUserId = (userId, callback) => {
  Account.find({ user_id: userId })
    .sort({ created_at: -1 })
    .then(results => callback(null, results))
    .catch(err => callback(err));
};

const createTransaction = (userId, type, amount, callback) => {
  console.log("DB Insert:", { userId, type, amount });
  const newTransaction = new Account({ user_id: userId, type: type, amount: amount });
  newTransaction.save()
    .then(() => callback(null))
    .catch(err => {
      console.error("MongoDB Insert Error:", err);
      callback(err);
    });
};

const getBalance = (userId, callback) => {
  Account.aggregate([
    { $match: { user_id: userId } },
    { $group: {
      _id: null,
      balance: {
        $sum: {
          $cond: [
            { $eq: ["$type", "deposit"] },
            "$amount",
            { $multiply: ["$amount", -1] }
          ]
        }
      }
    }}
  ]).then(results => {
    const balance = results.length > 0 ? results[0].balance : 0;
    callback(null, [{ balance: balance }]);
  }).catch(err => callback(err));
};

const getAllCustomers = (callback) => {
  const User = mongoose.model('User');
  User.find({ role: 'customer' })
    .then(results => callback(null, results))
    .catch(err => callback(err));
};

module.exports = { getTransactionsByUserId, createTransaction, getBalance, getAllCustomers };
