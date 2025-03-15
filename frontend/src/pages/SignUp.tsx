import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(''); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        setMessage('You are successfully signed up !');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Signup failed');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
      setTimeout(() => setMessage(''), 3000); 
    }
  };

  return (
    <div className="loginSignupPage">
      <center>
        <h1>Taskling</h1>
      </center>
      <div className="loginSignupContainer">
        <h2>Sign Up</h2>
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            required
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Last Name"
            required
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Sign Up</button>
        </form>
        <div className="loginSignupLink">
          Already have an account? <Link to="/SignIn">Sign In</Link>"
        </div>
      </div>
    </div>
  );
};

export default SignUp;
