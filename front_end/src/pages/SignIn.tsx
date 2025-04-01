import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); // Hook for navigation to other pages

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json(); 
      console.log('API Response:', result);

      if (response.ok) {
        // Redirect to the Tasks page on successful login
        navigate('/Tasks');
      } else {
        // Handle login error
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred. Please try again.');
    }
  };
  return (
    <div className="loginSignupPage">
      <center>
        <h1>Taskling YAS IT WORKS</h1>
      </center>
      <div className="loginSignupContainer">
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
          />
          <div className="passwordContainer">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <span className="togglePassword" onClick={togglePasswordVisibility}>
              <i className={`fas fa-${passwordVisible ? 'eye-slash' : 'eye'}`} />
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="loginSignupLink">
          New User? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

