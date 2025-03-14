import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here (e.g., API call)
    console.log('Sign Up Form Data:', formData);
  };

  return (
    <div className="loginSignupPage">
      <center>
        <h1>Taskling</h1>
      </center>
      <div className="loginSignupContainer">
        <h2>Sign Up</h2>
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
