import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here (e.g., API call)
    console.log('Login Data:', { email, password });
  };

  return (
    <div className="loginSignupPage">
      <center>
        <h1>Taskling</h1>
      </center>
      <div className="loginSignupContainer">
        <h2>Login</h2>
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
