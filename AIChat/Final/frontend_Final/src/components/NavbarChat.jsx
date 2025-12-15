import { React, useState } from 'react';
import '../styles/NavbarChat.css';

const NavbarChat = () => {
    const [showSignUp, setSignUp] = useState(false);
    const handleOpenSignUp = () => setSignUp(true);
    const handleCloseSignUp = () => setSignUp(false);

    return (

        <nav className="navbarChat">
            <div className="navbar-left2">
                <a target="_blank" href="#"><img src="/assets/icons/SJLogo2.svg" alt="SwipeJobb Logo" className="logoNew" /></a>
                <ul className="nav-links-chat">
                    <li>
                        <a href="/jobs">Find Jobs</a>
                    </li>
                    <li>
                        <a href="/companies">Companies</a>
                    </li>
                    <li>
                        <a href="/courses">Courses</a>
                    </li>
                    <li>
                        <a href="/Resources">Resources</a>
                    </li>
                </ul>
            </div>

            <div className="navbar-right-chat">

            </div>

        </nav >

    );
};

export default NavbarChat;