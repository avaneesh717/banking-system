// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const {
  authMiddleware,
  getTransactions,
  postTransaction,
  getCustomers,
  getCustomerTransactions,
  getBalance
} = require('../controllers/accountController');

// CUSTOMER routes
router.get('/customer/transactions', authMiddleware, getTransactions);
router.post('/customer/transactions', authMiddleware, postTransaction);
router.get('/customer/balance', authMiddleware, getBalance);

// BANKER routes
router.get('/customers', authMiddleware, getCustomers);
router.get('/customers/:id/transactions', authMiddleware, getCustomerTransactions);

module.exports = router;
