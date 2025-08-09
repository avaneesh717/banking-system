import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Optional if needed in backend
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Send request to backend
      const res = await API.post('/user/login', { email, password, role });

      // Store token & user details
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('name', res.data.name);

      alert('Login successful');

      // Redirect based on role
      if (res.data.role === 'customer') {
        navigate('/customer');
      } else {
        navigate('/banker');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="banker">Banker</option>
      </select>
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
      <button onClick={handleLogin}>Login</button>
      <p style={{ marginTop: '10px' }}>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}
