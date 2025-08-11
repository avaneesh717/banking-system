import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function BankerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      const res = await API.get('/account/customers');
      console.log('Customers loaded:', res.data);
      setCustomers(res.data);
      setSelectedTransactions([]);
      setSelectedCustomerName('');
    } catch (error) {
      alert('Failed to load customers');
      console.error(error);
    }
  };

  const viewTransactions = async (id, name) => {
    try {
      setLoading(true);
      console.log('Fetching transactions for customer:', id, name);
      const res = await API.get(`/account/customers/${id}/transactions`);
      console.log('Transactions response:', res.data);
      setSelectedTransactions(res.data);
      setSelectedCustomerName(name);
    } catch (error) {
      console.error('Error loading transactions:', error);
      alert('Failed to load transactions: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="dashboard">
      <h2>Banker Dashboard</h2>

      <h3>All Customers</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c._id || c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => viewTransactions(c._id || c.id, c.name)}>
                  View Transactions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loading && <p>Loading transactions...</p>}

      {selectedTransactions.length > 0 && (
        <>
          <h3>{selectedCustomerName}'s Transaction History ({selectedTransactions.length} transactions)</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedTransactions.map((txn, index) => {
                console.log('Transaction data:', txn);
                const date = txn.created_at || txn.transaction_date || txn.timestamp || new Date();
                return (
                  <tr key={txn._id || txn.id || index}>
                    <td>{txn.type}</td>
                    <td>₹{txn.amount}</td>
                    <td>{new Date(date).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {selectedTransactions.length === 0 && selectedCustomerName && !loading && (
        <p>No transactions found for {selectedCustomerName}</p>
      )}
    </div>
  );
}
