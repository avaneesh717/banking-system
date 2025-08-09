// src/components/TransactionModal.jsx
import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function TransactionModal({ type, close }) {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  // fetch balance from backend
  const loadBalance = async () => {
    try {
      const res = await API.get('/account/customer/balance');
      setBalance(res.data.balance ?? 0);
    } catch (err) {
      console.error('Error fetching balance', err);
      setBalance(0);
    }
  };

  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      return alert('Enter a valid amount');
    }

    setLoading(true);
    try {
      await API.post('/account/customer/transactions', {
        type,
        amount: amt
      });

      // refresh balance so user sees the updated value quickly
      await loadBalance();

      alert(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful`);
      close(); // parent will re-fetch transactions
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ textTransform: 'capitalize', marginBottom: 8 }}>{type}</h3>
        <p>Current Balance: ₹{Number(balance).toFixed(2)}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            style={{ width: '100%', padding: 8, margin: '10px 0' }}
            required
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
            {loading ? 'Processing...' : (type === 'deposit' ? 'Deposit' : 'Withdraw')}
          </button>
          <button type="button" onClick={close} style={{ width: '100%', padding: 10, marginTop: 8 }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
