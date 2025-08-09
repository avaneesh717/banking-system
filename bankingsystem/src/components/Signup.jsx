import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      alert('Please fill all fields');
      return;
    }

    try {
      await API.post('/user/signup', { name, email, password, role });
      alert('Signup successful. Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="login">
      <h2>Sign Up</h2>
      <input
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="banker">Banker</option>
      </select>
      <button onClick={handleSignup}>Sign Up</button>
      <p style={{ marginTop: '10px' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}
