import React from "react";
import { Outlet, Link } from "react-router-dom";
import tamagoIcon from "../assets/tamagoIcon.png";
import accountIcon from "../assets/accountIcon.png";
import listIcon from "../assets/listIcon.png";
import shopIcon from "../assets/shopIcon.png";
import signOutIcon from "../assets/signOutIcon.png"; // Make sure you have an appropriate icon

const Layout: React.FC = () => {
    return (
        <>
            {/* Navbar Section */}
            <nav className="nav fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-50">
                <Link to="/" className="TamagoTitle text-xl font-bold">Taskling</Link>
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
                    <li>
                        <Link to="/signin">
                            <img className="icon w-6 h-6" src={signOutIcon} alt="Sign Out Icon" />
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Page Content */}
            <main className="mt-16 p-4">
                <Outlet /> {/* This dynamically renders the current page */}
            </main>
        </>
    );
};

export default Layout;
