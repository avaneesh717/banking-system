// src/components/CustomerDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/api';
import TransactionModal from './TransactionModal';

export default function CustomerDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/account/customer/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions', err);
      // optional: show a user-friendly message
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="dashboard">
      <h2>Customer Dashboard</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={() => { setActionType('deposit'); setShowModal(true); }}>Deposit</button>
        <button onClick={() => { setActionType('withdrawal'); setShowModal(true); }}>Withdraw</button>
      </div>

      <table>
        <thead><tr><th>Type</th><th>Amount</th><th>Date</th></tr></thead>
        <tbody>
          {transactions.map(txn => (
            <tr key={txn.id}>
              <td>{txn.type}</td>
              <td>₹{txn.amount}</td>
              <td>{new Date(txn.created_at || txn.transaction_date || txn.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <TransactionModal
          type={actionType}
          close={() => {
            setShowModal(false);
            fetchTransactions(); // refresh after close
          }}
        />
      )}
    </div>
  );
}
