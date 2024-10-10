import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Loginform.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState(''); // To show error messages if login fails
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Create the login data to send in the POST request
    const loginData = {
      email: username, // Assuming 'username' is actually the email
      password: password,
      role: role, // Include the role in the login data
    };

    try {
      // Send the POST request to the Flask API
      const response = await fetch('http://localhost:5000/', { // Ensure the correct endpoint is used
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      // Check if the login was successful
      if (response.ok) {
        // Navigate to the correct dashboard based on the role
        if (role.toLowerCase() === 'admin') {
          navigate('/admin');
        } else if (role.toLowerCase() === 'customer') {
          navigate('/customer');
        }
      } else {
        // Display error message if login fails
        setError(result.error || 'Invalid login credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-form">
      <h2>FeedBack Form APQ</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
}

export default LoginForm;
