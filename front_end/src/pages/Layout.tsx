import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useState } from "react"; // Import useState for managing state
import backgroundImg from "../assets/background1.jpg";
import tamagoImg from "../assets/tamago1.png"; // Import the image
import "./style.css"; // Import your CSS file
import tamagoIcon from "../assets/tamagoIcon.png";
import accountIcon from "../assets/accountIcon.png";
import listIcon from "../assets/listIcon.png";
import shopIcon from "../assets/shopIcon.png";
import SignIn from "./SignIn"; // Import the SignIn component
import SignUp from "./SignUp"; // Import the SignUp component

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook to programmatically navigate
  const isLayoutPage = location.pathname === '/';
  const isSignInPage = location.pathname === '/signin'; // Check if the current page is the signin page
  const isSignInPageCap = location.pathname === '/SignIn'; // Check if the current page is the signin page
  const isSignUpPage = location.pathname === '/signup'; // Check if the current page is the signup page
  const isSignUpPageCap = location.pathname === '/SignUp'; // Check if the current page is the signup page

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
        <div className="home-flex" style={{ marginBottom: '64px' }}>
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

      {/* Navigation Bar and Page Content */}
      {!isLayoutPage && !isSignInPage && !isSignUpPage && !isSignInPageCap && !isSignInPageCap && (
        <>
          {/* Navbar Section */}
          <nav className="nav fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
            <Link to="/" className="TamagoTitle text-xl font-bold">
              Taskling
            </Link>
            <ul className="flex space-x-4">
              <li>
                <Link to="/tamago">
                  <img className="icon w-6 h-6" src={tamagoIcon} alt="Home Icon" />
                </Link>
              </li>
              <li>
                <Link to="/account">
                  <img className="icon w-6 h-6" src={accountIcon} alt="Account Icon" />
                </Link>
              </li>
              <li>
                <Link to="/tasks">
                  <img className="icon w-6 h-6" src={listIcon} alt="Tasks Icon" />
                </Link>
              </li>
              <li>
                <Link to="/shop">
                  <img className="icon w-6 h-6" src={shopIcon} alt="Shop Icon" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Page Content */}
          <main className="mt-16 p-4">
            <Outlet />
          </main>
        </>
      )}

      {/* Sign-In Page Content */}
      {isSignInPage && <SignIn /> || isSignInPageCap && <SignIn />} {/* Render the SignIn component */}

      {/* Sign-Up Page Content */}
      {isSignUpPage && <SignUp /> || isSignUpPageCap && <SignUp />} {/* Render the SignIn component */}
    </div>
  );
}