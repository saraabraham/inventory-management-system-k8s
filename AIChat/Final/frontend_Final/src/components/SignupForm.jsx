import React, { useState } from "react";
import Modal from "react-modal";
import '../styles/SignupForm.css';


// Required for accessibility
Modal.setAppElement("#root");

const SignupForm = ({ isOpen, onRequestClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const formData = new FormData(event.target);

        try {
            const response = await fetch("/users/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.get("userEmail"),
                    password: formData.get("userPassword"),
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Signup failed.");

            setSuccess("Signup successful! 🎉");
            setTimeout(() => {
                onRequestClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="signup-modal"
            overlayClassName="signup-overlay"
            contentLabel="Signup Form Modal"
        >


            <h2><img src="/assets/icons/Ellipse 2603.svg" alt="icon"></img>Join the career AI Assistant</h2>
            <button className="signGoogle"><img src="/assets/icons/googleSignIn.svg" alt="google signin"></img>Continue with Google</button>
            <div className="seperator"><hr /> or<hr /></div>

            <form onSubmit={handleSubmit} name="signupForm">
                <label id="userName" htmlFor="name-input">Full Name</label>
                <input
                    id="name-input"
                    name="userName"
                    required
                    type="text"
                    placeholder="Enter your Name"
                />

                <label id="userEmail" htmlFor="email-input">Email Address</label>
                <input
                    autoComplete="email"
                    id="email-input"
                    name="userEmail"
                    required
                    type="email"
                    placeholder="Enter your email"
                />

                <label id="password" htmlFor="password-input">Password</label>
                <input
                    aria-describedby="password-hint"
                    autoComplete="new-password"
                    id="password-input"
                    minLength="8"
                    name="userPassword"
                    required
                    type="password"
                    placeholder="Create a password"
                />

                <div className="nextSteps">
                    What would you like to do?<br></br>
                    <div className="radio">
                        <div className="radio-container">
                            <label><input id="rb1" type="radio" radioGroup="rb1" />Apply for jobs on SwipeJobb</label>
                        </div>
                        <div className="radio-container">
                            <label> <input id="rb2" type="radio" radioGroup="rb2" />Share my profile with employers</label>
                        </div>

                    </div>

                </div>


                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <div className="start">
                    <button id="cancel" onClick={onRequestClose}>Cancel</button>
                    <button id="signUp" type="submit">Get Started</button>

                </div>
            </form>
        </Modal>
    );
};

export default SignupForm;
