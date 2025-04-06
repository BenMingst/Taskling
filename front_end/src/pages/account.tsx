import React, { useEffect, useState } from "react";
import "./style.css";
import "./account.css";
import { Link } from "react-router-dom";
import { FaUserCircle, FaUsers, FaList, FaShoppingCart } from "react-icons/fa";

const API_BASE_URL = import.meta.env.PROD
  ? "http://161.35.186.141:5003/api"
  : "http://localhost:5003/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  xp_number: number;
  level: number;
  family: User[]; // Family is an array of User objects
  coins: number;
  ownedItems: string[];
  tasks: string[];
  completedTasks: string[];
  completedTasksCount: number;
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
    // User progress bar animation
    const progressValue = document.getElementById("myBar");
    let progressStartValue = 0;
    const progressEndValue = 70;
    const speed = 50;

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
    <div className="account-page">

      <div className="main-content">
        <div className="user-information personal">
          <div className="progress-container">
            <div className="progress-bar" id="myBar"></div>
            <div className="user-progress">
              <p>Level {user.level}</p>
              <span>
                <i
                  className="fa-solid fa-user"
                  style={{ fontSize: "24px" }}
                ></i>
              </span>
              <p>{user.xp_number} xp</p>
            </div>
          </div>
          <p className="user-name">{user.firstName} {user.lastName}</p>
        </div>

        <p className="family-header">My Family</p>

        <div className="family-list">
          {user.family.map((familyMember, index) => (
            <div className="family-information" key={index}>
              <div className="family-container">
                <div
                  className="family-progress-bar"
                  id={`familyBar${index}`}
                ></div>
                <div className="family-progress">
                  <p>Level {familyMember.level}</p>
                  <span>
                    <i
                      className="fa-solid fa-user"
                      style={{ fontSize: "15px" }}
                    ></i>
                  </span>
                  <p>{familyMember.xp_number} xp</p>
                </div>
              </div>
              <p className="user-name family">{familyMember.firstName} {familyMember.lastName}</p>
            </div>
          ))}
          <button className="add-member-button">+</button>
        </div>
      </div>
    </div>
  );
};

export default Account;
