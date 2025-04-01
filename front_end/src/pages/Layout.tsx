import React from "react";
import { Outlet, Link } from "react-router-dom";
import tamagoIcon from "../assets/tamagoIcon.png";
import accountIcon from "../assets/accountIcon.png";
import listIcon from "../assets/listIcon.png";
import shopIcon from "../assets/shopIcon.png";

const Layout: React.FC = () => {
    return (
        <>
            {/* Navbar Section */}
            <nav className="nav">
                <Link to="/" className="TamagoTitle">Taskling</Link>
                <ul>
                    <li>
                        <Link to="/">
                            <img className="icon" src={tamagoIcon} alt="Home Icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/account">
                            <img className="icon" src={accountIcon} alt="Account Icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/tasks">
                            <img className="icon" src={listIcon} alt="Tasks Icon" />
                        </Link>
                    </li>
                    <li>
                        <Link to="/shop">
                            <img className="icon" src={shopIcon} alt="Shop Icon" />
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Page Content */}
            <main>
                <Outlet /> {/* This dynamically renders the current page */}
            </main>
        </>
    );
};

export default Layout;
