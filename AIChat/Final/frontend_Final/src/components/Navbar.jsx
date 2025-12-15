import { React, useState } from 'react';
import SignupForm from './SignupForm';
import '../styles/Navbar.css';

const Navbar = () => {
    const [showSignUp, setSignUp] = useState(false);
    const handleOpenSignUp = () => setSignUp(true);
    const handleCloseSignUp = () => setSignUp(false);

    return (

        <nav className="navbar">
            <div className="navbar-left">
                <a target="_blank" href="https://www.swipejobb.se/en"><img src="/assets/icons/SJLogo.svg" alt="SwipeJobb Logo" className="logo" /></a>
                <ul className="nav-links">
                    <li>
                        <a href="/products">Jobs</a>
                    </li>
                    <li>
                        <a href="/about">Pricing</a>
                    </li>
                    <li>
                        <a href="/contact">Companies</a>
                    </li>
                    <li>
                        <a href="/contact">About</a>
                    </li>
                </ul>
            </div>

            <div className="navbar-right">
                <button id="login">Log in</button>
                <button id="signup" onClick={handleOpenSignUp}>Sign up</button>
            </div>
            <SignupForm
                isOpen={showSignUp}
                onRequestClose={handleCloseSignUp}
            />
        </nav >

    );
};

export default Navbar;