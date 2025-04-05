import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const BASE_URL_API = "http://taskling.site/api";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(''); 
    const navigate = useNavigate();

    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        validatePassword(e.target.value);
        setNewPassword(e.target.value);
      };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
      };
      
      const handleResetPassword = async () => {
        try {
            const response = await fetch(`${BASE_URL_API}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Password reset failed");
            }
            
            alert(data.message);
            navigate('/signin'); 
        } catch (err) {
            const errorMessage = err instanceof Error 
                ? err.message 
                : "Password reset failed";
            
            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const validatePassword = (password: string) => {
        setPasswordValidations({
          length: password.length >= 8,
          uppercase: /[A-Z]/.test(password),
          lowercase: /[a-z]/.test(password),
          number: /\d/.test(password),
          specialChar: /[@$!%*?&]/.test(password),
        });
      };

    return (
    <div className="loginSignupPage">
      <center>
        <h1>Reset Password</h1>
      </center>
      <div className="loginSignupContainer">
        {error && <div className="error">{error}</div>}
          <div className="passwordContainer">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={handlePasswordChange}
            />
            <span className="togglePassword" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
            </span>
          </div>

          <div className="password-hints">
            {passwordValidations.length ? '✅' : '❌'} 8+ characters &nbsp;
            {passwordValidations.uppercase ? '✅' : '❌'} 1 uppercase &nbsp;
            {passwordValidations.lowercase ? '✅' : '❌'} 1 lowercase &nbsp;
            {passwordValidations.number ? '✅' : '❌'} 1 number &nbsp;
            {passwordValidations.specialChar ? '✅' : '❌'} 1 special (@$!%*?&)
          </div>

          <button onClick={handleResetPassword}>Reset Password</button>  
      </div>
      <style>
        {`
          .password-hints {
            font-size: 12px;
            color: #333;
            margin: 5px 0;
          }
        `}
      </style>
    </div>
    );
};

export default ResetPassword;