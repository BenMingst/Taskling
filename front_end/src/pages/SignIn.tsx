import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 
  const BASE_URL_API = "http://taskling.site/api";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  //FORGOT PASSWORD
  const handleForgotPassword = async () => {
    if (!email) {
        alert("Please enter your email first.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL_API}/request-password-reset`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Password reset email sent! Check your inbox.");
        } else {
            alert(data.error || "Something went wrong.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to send password reset email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json(); 
      console.log('API Response:', result);

      if (response.ok) {
        // Store the message and userId in localStorage
        localStorage.setItem('userId', result.userId);  
        localStorage.setItem('message',result.message);
        
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
        <h1>Sign In</h1>
      </center>
      <div className="loginSignupContainer">
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
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="loginSignupLink">
          <span style={{ color: "black", fontSize: "12px" }}>Forgot Password? </span>
            <span
              onClick={handleForgotPassword}
              className='clickHere'
            >
              Click Here
            </span>
            <div>
              New User? <Link to="/signup">Sign Up</Link>
            </div>
        </div>           
      </div>
    </div>
  );
};

export default Login;

