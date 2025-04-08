import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react"; // Import useState for managing state
import backgroundImg from "../assets/background1.jpg";
import tamagoImg from "../assets/tamago1.png"; // Import the image
import "./style.css"; // Import your CSS file

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook to programmatically navigate
  const isLayoutPage = location.pathname === '/';

  // State to manage the speech bubble content
  const [bubbleContent, setBubbleContent] = useState("Click me to get started!");

  // State to manage the bounce animation
  const [isBouncing, setIsBouncing] = useState(false);

  // Function to update the speech bubble content and trigger the bounce animation
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent immediate navigation
    setBubbleContent("Let's go!");

    // Trigger the bounce animation
    setIsBouncing(true);

    // Navigate to the signin page after the animation ends
    setTimeout(() => {
      setIsBouncing(false);
      navigate("/signin"); // Programmatically navigate to the signin page
    }, 600); // Match the duration of the bounce animation (0.6s)
  };

  return (
    <div
      className={isLayoutPage ? 'layout-background' : 'default-background'}
      style={
        isLayoutPage
          ? {
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '100vh',
            }
          : { backgroundColor: '#FEFAE0', minHeight: '100vh' }
      }
    >
      {/* Centered Welcome Message */}
      {isLayoutPage && (
        <div className="flex" style={{ marginBottom: '64px' }}>
          <h1 className="layout-heading text-4xl font-bold text-black text-center">
            Welcome to Taskling
          </h1>

          {/* Comment Box */}
          <div className="comment-box">
            {bubbleContent} {/* Dynamically display the bubble content */}
          </div>

          {/* Tamago Button with Comment Box */}
          <div className="relative group">
            <a href="/signin" onClick={handleButtonClick}>
              <img
                src={tamagoImg}
                alt="Tamago Button"
                className={`home-signin-button ${isBouncing ? 'bounce' : ''}`}
              />
            </a>
          </div>
        </div>
      )}

      {/* Page Content */}
      {!isLayoutPage && (
        <main className="mt-16 p-4">
          <Outlet />
        </main>
      )}
    </div>
  );
}