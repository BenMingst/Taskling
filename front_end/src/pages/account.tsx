import React, { useEffect, useState } from "react";
import "./style.css";
import "./account.css";
//import { Link } from "react-router-dom";
//import { FaUserCircle, FaUsers, FaList, FaShoppingCart } from "react-icons/fa";

const API_BASE_URL = import.meta.env.PROD
  ? "https://taskling.site/api" // if it is in production
  : "http://localhost:5003/api"; // development

const Account: React.FC = () => {
  // Define state variables
  interface User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string; // Add other fields as needed
    coins: number;
    xpNumber:number;
  }

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

        console.log("User ID:", userId);
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user info");
        const data = await response.json();
        console.log("User Info:", data);
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Invoke fetchUserInfo when the component mounts
    fetchUserInfo();
  }, []);

  // User progress bar animation
  useEffect(() => {
    const progressValue = document.getElementById("myBar");
    let progressStartValue = 0;
    const progressEndValue = user?.xpNumber || 0;
    const speed = 50; // Adjust the speed value as needed

    const progress = setInterval(() => {
      if (progressStartValue >= progressEndValue) {
        clearInterval(progress);
      } else {
        progressStartValue++;
        if (progressValue) {
          progressValue.style.background = `conic-gradient(rgb(53, 181, 53) 0% ${progressStartValue}%, #F1F1F1 ${progressStartValue}% 100%)`;
        }
      }
    }, speed);

    // Family progress bar animations
    const familyBars = [
      { id: "familyBar1", endValue: 70 },
      { id: "familyBar2", endValue: 70 },
      { id: "familyBar3", endValue: 70 },
      { id: "familyBar4", endValue: 70 },
    ];

    familyBars.forEach(({ id, endValue }) => {
      const familyProgressValue = document.getElementById(id);
      let familyProgressStartValue = 0;

      const familyProgress = setInterval(() => {
        if (familyProgressStartValue >= endValue) {
          clearInterval(familyProgress);
        } else {
          familyProgressStartValue++;
          if (familyProgressValue) {
            familyProgressValue.style.background = `conic-gradient(rgb(53, 181, 53) 0% ${familyProgressStartValue}%, #F1F1F1 ${familyProgressStartValue}% 100%)`;
          }
        }
      }, speed);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found. Please log in.</div>;
  }

  return (
    <>
      <div className="account-page">

        <div className="main-content">
          <div className="user-information personal">
            <div className="progress-container">
              <div className="progress-bar" id="myBar"></div>
              <div className="user-progress">
                <p>Level 7</p>
                <span>
                  <i
                    className="fa-solid fa-user"
                    style={{ fontSize: "24px" }}
                  ></i>
                </span>
                <p>350 xp</p>
              </div>
            </div>
            <p className="user-name">{user.username || "User Name"}</p>
          </div>

          <p className="family-header">My Family</p>

          <div className="family-list">
            {[1, 2, 3, 4].map((index) => (
              <div className="family-information" key={index}>
                <div className="family-container">
                  <div
                    className="family-progress-bar"
                    id={`familyBar${index}`}
                  ></div>
                  <div className="family-progress">
                    <p>Level 7</p>
                    <span>
                      <i
                        className="fa-solid fa-user"
                        style={{ fontSize: "15px" }}
                      ></i>
                    </span>
                    <p>350 xp</p>
                  </div>
                </div>
                <p className="user-name family">Adam Adams</p>
              </div>
            ))}
            <button className="add-member-button">+</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;