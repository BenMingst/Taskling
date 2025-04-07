import { Outlet, Link, useLocation } from "react-router-dom";
import tamagoIcon from "../assets/tamagoIcon.png";
import accountIcon from "../assets/accountIcon.png";
import listIcon from "../assets/listIcon.png";
import shopIcon from "../assets/shopIcon.png";
import signOutIcon from "../assets/signOutIcon.png"; 
import backgroundImg from "../assets/background1.jpg";

export default function Layout() {
    const location = useLocation();
    const isLayoutPage = location.pathname === '/';
  
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
            : {backgroundColor: '#FEFAE0',
                minHeight: '100vh',}
        }
      >
        {/* Navbar Section */}
        <nav className="nav fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
          <Link to="/" className="TamagoTitle text-xl font-bold">
            Taskling
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/SignIn">
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
  
        {/* Centered Welcome Message */}
        {isLayoutPage && (
          <div className="flex items-center justify-center style={{  marginbottom: '64px' }}">
            <h1 className="layout-heading text-4xl font-bold text-black text-center">
                Welcome to Taskling
            </h1>

          </div>
        )}
  
        {/* Page Content */}
        {!isLayoutPage && (
          <main className="mt-16 p-4">
            <Outlet /> {/* Dynamically renders the current page */}
          </main>
        )}
      </div>
    );
  }
  
