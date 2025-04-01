import React from "react";
import { Link } from "react-router-dom";

const EmailVerifiedPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.headingContainer}>
        
        <h1 style={styles.heading}>Email Verified</h1>
      </div>
      <div style={styles.spacer} />
      <Link to="/SignIn" style={styles.link}>
        Go to Login Page
      </Link>
    </div>
  );
};

const styles = {
  container: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    textAlign: "center" as const,
    backgroundColor: "#FEFAE0",
    margin: 0,
    padding: 0,
  },
  headingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  icon: {
    width: "2rem",
    height: "2rem",
  },
  heading: {
    color: "#008000",
    fontSize: "2.5rem",
    margin: 0, 
    order: -1,
  },
  spacer: {
    height: "2rem",
  },
  link: {
    color: "#B49CEF",
    fontSize: "1rem",
    textDecoration: "none",
    border: "1px solid #B49CEF",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    transition: "all 0.3s ease",
    marginTop: "1rem",
  },
};

export default EmailVerifiedPage;