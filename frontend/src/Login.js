import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { setEnteredUsername } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5000/login', { username, password });
          if (response.data.success) {
            setEnteredUsername(username);
          } else {
            setError(response.data.message);
          }
        } catch (err) {
          setError('Login failed');
        }
      };

  return (
    <div className="card">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Log in</button>
      </form>
      {/* Add the register link to redirect to the registration page */}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
