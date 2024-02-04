import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { setEnteredUsername } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      if (response.data.success) {
        // Set the enteredUsername after successful registration
        setEnteredUsername(username);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className='card'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Registration;
