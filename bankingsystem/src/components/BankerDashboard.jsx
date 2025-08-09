import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function BankerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  const fetchCustomers = async () => {
    try {
      const res = await API.get('/account/customers');
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
      const res = await API.get(`/account/customers/${id}/transactions`);
      setSelectedTransactions(res.data);
      setSelectedCustomerName(name);
    } catch (error) {
      alert('Failed to load transactions');
      console.error(error);
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
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => viewTransactions(c.id, c.name)}>
                  View Transactions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTransactions.length > 0 && (
        <>
          <h3>{selectedCustomerName}'s Transaction History</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedTransactions.map(txn => {
  console.log('created_at value:', txn.created_at);
  return (
    <tr key={txn.id}>
      <td>{txn.type}</td>
      <td>₹{txn.amount}</td>
      <td>{new Date(txn.created_at).toLocaleString()}</td>

    </tr>
  );
})}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
