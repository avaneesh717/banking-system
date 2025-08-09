import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Signup from './components/Signup';          // new import
import CustomerDashboard from './components/CustomerDashboard';
import BankerDashboard from './components/BankerDashboard';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<Signup />} />         {/* new route */}
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/banker" element={<BankerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

