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
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  const passwordRequirements = [
    { key: 'length', text: 'At least 8 characters' },
    { key: 'uppercase', text: 'At least one uppercase letter' },
    { key: 'lowercase', text: 'At least one lowercase letter' },
    { key: 'number', text: 'At least one number' },
    { key: 'specialChar', text: 'At least one special character (@$!%*?&)' },
  ];

  const validatePassword = (password: string) => {
    setPasswordValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all conditions are met
    if (!Object.values(passwordValidations).every(Boolean)) {
      setMessage('Password does not meet all requirements.');
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
        setMessage('You are successfully signed up!');
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

          <ul className="password-requirements">
            {passwordRequirements.map(({ key, text }) => (
              <li key={key} className={passwordValidations[key as keyof typeof passwordValidations] ? 'valid' : 'invalid'}>
                {text}
              </li>
            ))}
          </ul>

          <button type="submit">Sign Up</button>
        </form>
        <div className="loginSignupLink">
          Already have an account? <Link to="/SignIn">Sign In</Link>
        </div>
      </div>

      <style>
        {`
          .password-requirements {
            list-style-type: none;
            padding: 0;
            margin: 10px 0;
          }
          .password-requirements li {
            font-size: 14px;
            padding: 3px;
          }
          .valid {
            color: green;
          }
          .invalid {
            color: red;
          }
        `}
      </style>
    </div>
  );
};

export default SignUp;
