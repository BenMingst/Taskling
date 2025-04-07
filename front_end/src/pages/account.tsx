import React, { useEffect, useState } from "react";
import "./style.css"; // Ensure this file exists in the same directory or update the path
import "./account.css"; // Ensure this file exists in the same directory or update the path

const API_BASE_URL = import.meta.env.PROD
  ? "http://161.35.186.141:5003/api"
  : "http://localhost:5003/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  level: number; // This will now be dynamically calculated
  coins: number; // This will now be dynamically calculated
  total_coins: number; // Replace coins with total_coins
  ownedItems: string[];
}

const Account: React.FC = () => {
  // State to store user data
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in localStorage");
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data: User = await response.json();

        // Dynamically calculate the level based on total_coins
        data.level = Math.floor(data.coins / 100);

        setUser(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!user) return; // Ensure user is not null before proceeding

    // User progress bar animation
    const progressValue = document.getElementById("myBar");
    let progressStartValue = 0;
    const progressEndValue = user.coins; // Use total_coins here
    const speed = 50;

    const progress = setInterval(() => {
      if (progressStartValue >= progressEndValue) {
        clearInterval(progress);
      } else {
        progressStartValue++;
        if (progressValue) {
          const percentage = progressEndValue % 100; // Store percentage in a variable
          progressValue.style.background = `conic-gradient(rgb(53, 181, 53) 0% ${percentage}%, #F1F1F1 ${percentage}%)`;
        }
      }
    }, speed);

    return () => clearInterval(progress); // Cleanup interval on component unmount
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <div>User not found. Please log in.</div>;
  }

  return (
    <div className="account-page">
      <div className="account-info">
        <h1 className="account-header">Account Information</h1>
        <div className="user-details">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Coins:</strong> {user.coins}</p>
        </div>
      </div>

      <button onClick={() => localStorage.clear()}>Logout</button>
    </div>
  );
};

export default Account;
