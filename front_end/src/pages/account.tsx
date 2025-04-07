import React, { useEffect, useState } from "react";
import "./style.css";
import "./account.css";

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
        data.level = Math.floor(data.total_coins / 100);

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
    const progressEndValue = user.total_coins; // Use total_coins here
    const speed = 50;

    const progress = setInterval(() => {
      if (progressStartValue >= progressEndValue) {
        clearInterval(progress);
      } else {
        progressStartValue++;
        if (progressValue) {
          const percentage = progressStartValue % 100; // Store percentage in a variable
          progressValue.style.background = `conic-gradient(rgb(53, 181, 53) 0% ${percentage}%, #F1F1F1 ${percentage}% 100%)`;
        }
      }
    }, speed);

    return () => clearInterval(progress); // Cleanup interval on component unmount
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found. Please log in.</div>;
  }

  return (
    <div className="account-page">
      <div className="main-content">
        <div className="user-information personal">
          <div className="progress-container">
            <div className="progress-bar" id="myBar"></div>
            <div className="user-progress">
              <p>Level {Math.floor(user.total_coins / 100)}</p> {/* Dynamically display level */}
              <span>
                <i
                  className="fa-solid fa-user"
                  style={{ fontSize: "24px" }}
                ></i>
              </span>
              <p>{user.total_coins} total coins</p> {/* Display total_coins */}
            </div>
          </div>
          <p className="user-name">{user.firstName} {user.lastName}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
