const {
  getTransactionsByUserId,
  createTransaction,
  getBalance: modelGetBalance,
  getAllCustomers
} = require('../models/accountModel');
const { findUserByToken } = require('../models/userModel');

/* Auth middleware (unchanged) */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  findUserByToken(token, (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Invalid token' });
    req.user = results[0];
    next();
  });
};

/* Get transactions for logged-in user */
const getTransactions = (req, res) => {
  getTransactionsByUserId(req.user.id, (err, results) => {
    if (err) {
      console.error("Get transactions error:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

/* Create deposit/withdraw transaction */
const postTransaction = (req, res) => {
  let { type, amount } = req.body;
  amount = parseFloat(amount);

  console.log("PostTransaction called with:", { userId: req.user.id, type, amount }); // Debug log input

  if (!type || isNaN(amount) || amount <= 0) {
    console.log("Invalid request data");
    return res.status(400).json({ message: 'Invalid request' });
  }

  // normalize type: accept 'withdrawal' or 'withdraw'
  if (type === 'withdraw') type = 'withdrawal';
  if (type === 'deposit') type = 'deposit'; // optional, for clarity
  if (type !== 'deposit' && type !== 'withdrawal') {
    console.log("Invalid transaction type:", type);
    return res.status(400).json({ message: 'Invalid transaction type' });
  }

  if (type === 'withdrawal') {
    modelGetBalance(req.user.id, (err, result) => {
      if (err) {
        console.error("Error fetching balance:", err);
        return res.status(500).json({ message: 'Error fetching balance' });
      }
      const balance = (result && result[0] && result[0].balance) ? parseFloat(result[0].balance) : 0;
      console.log("Current balance:", balance);
      if (amount > balance) {
        console.log("Insufficient funds for withdrawal");
        return res.status(400).json({ message: 'Insufficient Funds' });
      }

      createTransaction(req.user.id, type, amount, (err2) => {
        if (err2) {
          console.error("Error saving withdrawal transaction:", err2);
          return res.status(500).json({ message: 'Error saving transaction' });
        }
        return res.json({ message: 'Withdrawal successful' });
      });
    });
  } else {
    // deposit
    createTransaction(req.user.id, type, amount, (err) => {
      if (err) {
        console.error("Error saving deposit transaction:", err);
        return res.status(500).json({ message: 'Error saving transaction' });
      }
      return res.json({ message: 'Deposit successful' });
    });
  }
};

/* Get balance for logged-in user */
const getBalance = (req, res) => {
  modelGetBalance(req.user.id, (err, result) => {
    if (err) {
      console.error("Error fetching balance:", err);
      return res.status(500).json({ message: 'Error fetching balance' });
    }
    const balance = (result && result[0] && result[0].balance) ? parseFloat(result[0].balance) : 0;
    res.json({ balance });
  });
};

/* Banker: list all customers */
const getCustomers = (req, res) => {
  getAllCustomers((err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

/* Banker: get specific customer transactions */
const getCustomerTransactions = (req, res) => {
  const userId = req.params.id;
  getTransactionsByUserId(userId, (err, results) => {
    if (err) {
      console.error("Error fetching customer transactions:", err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
};

module.exports = {
  authMiddleware,
  getTransactions,
  postTransaction,
  getCustomers,
  getCustomerTransactions,
  getBalance
};
