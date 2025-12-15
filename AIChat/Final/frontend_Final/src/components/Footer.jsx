import React, { useState } from "react";
import '../styles/Footer.css';
import DropDown2 from "./DropDown2";
import DropDown from "./DropDown";
import countriesFooter from "../data/countries_footer";
import industries from "../data/industries";
import DropDownFooter from "./DropDownFooter";
import hrProfessionals from "../data/hrProfessionals";
import HRCard from "./HRCard";


const Footer = () => {
    const [expert, setExpert] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [country, setCountry] = useState("");
    const [countryError, setCountryError] = useState(false);
    const [industry, setIndustry] = useState("");
    const [industryError, setIndustryError] = useState(false);
    const [exp, setExp] = useState("");
    const [expError, setExpError] = useState(false);
    const [showNewPopup, setNewPopup] = useState(false);


    const handleChange = (value) => {
        setExpert(value);

        // Show popup if HR Professionals selected
        if (value === "HR Professionals") {
            setShowPopup(true);
        } else {
            setShowPopup(false);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const filteredHR = hrProfessionals.filter(hr =>
        hr.country?.trim().toLowerCase() === country?.trim().toLowerCase() &&
        hr.experience?.trim().toLowerCase() === exp?.trim().toLowerCase() &&
        hr.industry?.trim().toLowerCase() === industry?.trim().toLowerCase()
    );

    return (
        <div className="footer">
            <h2>Need Something specific? We're here to help!</h2>

            <DropDown2
                label="Contact our Career Experts"
                options={["HR Professionals", "Counsellors"]}
                value={expert}
                onChange={handleChange}
            />

            {/* Popup */}
            {showPopup && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <div className="popup-header-main">
                            <img className="popupIcon" src="/assets/icons/HrLookup.svg"></img>
                            <div className="popup-header">
                                <h3>HR Professionals</h3>
                                <p>Find the perfect HR expert for your needs</p>
                            </div>
                            <button onClick={closePopup} className="closeBtn"><img src="/assets/icons/closePop.svg" className="closeImg"></img></button>
                        </div>

                        <div className="popup-body">
                            <div className="popDrop">
                                <div className="drop1-container">
                                    <label>Select Country *</label>
                                    <DropDownFooter
                                        label="Select Country"
                                        options={countriesFooter}
                                        value={country}
                                        onChange={(value) => {
                                            setCountry(value);
                                            setCountryError(false); // clear error when user selects
                                        }}
                                    />
                                    {countryError && <p className="error-msg">Please select a country!</p>}
                                </div>

                                <div className="drop1-container">
                                    <label>Preferred Industry *</label>
                                    <DropDownFooter
                                        label="Select Industry"
                                        options={industries}
                                        value={industry}
                                        onChange={(value) => {
                                            setIndustry(value);
                                            setIndustryError(false);
                                        }}
                                    />
                                    {industryError && <p className="error-msg">Please select industry!</p>}
                                </div>

                                <div className="drop1-container">
                                    <label>Years of Experience *</label>
                                    <DropDownFooter
                                        label="Select Experience"
                                        options={["1-3 years", "4-8 years", "8+ years"]}
                                        value={exp}
                                        onChange={(value) => {
                                            setExp(value);
                                            setExpError(false);

                                        }}
                                    />
                                    {expError && <p className="error-msg">Please select experience!</p>}
                                </div>
                            </div>

                            <button onClick={() => {
                                if (!country) {
                                    setCountryError(true); // show error
                                    return;                // prevent opening new popup
                                }
                                if (!industry) {
                                    setIndustryError(true); // show error
                                    return;                // prevent opening new popup
                                }
                                if (!exp) {
                                    setExpError(true); // show error
                                    return;                // prevent opening new popup
                                }

                                setShowPopup(false);
                                setNewPopup(true);
                            }}><img className="HRIcon" src="/assets/icons/hrIcon.svg"></img>Find HR Professionals</button>




                        </div>
                    </div>
                </div>
            )}

            {showNewPopup && (
                <div className="new-popup-overlay">
                    <div className="new-popup">
                        <div className="new-popup-header">
                            <div className="header-title">
                                <h2>HR Professionals in {country} </h2>
                                <button className="closeBtn" onClick={() => setNewPopup(false)}><img src="/assets/icons/closePop.svg" className="closeImg"></img></button>

                            </div>
                            <p> {filteredHR.length} Verified professionals match your criteria</p>

                        </div>
                        <div className="new-popup-body">

                            {filteredHR.map((hr, index) => (
                                <HRCard key={index} data={hr} />
                            ))}
                        </div>

                    </div>
                </div>
            )
            }

            <hr />
            <div className="details">
                <div className="details1">
                    <p id="company">SwipeJobb</p>
                    <p id="companyTagLine">Connecting talent with opportunity through AI-powered career solutions.</p>
                    <div className="socialMedia">
                        <a href="" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/icons/twitter.svg" /></a>

                        <a href="https://www.linkedin.com/company/swipejob/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/icons/LinkedIn.svg" /></a>
                        <a href="https://www.facebook.com/swipejobb" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/icons/facebook.svg" />
                        </a>

                        <a href="https://www.instagram.com/swipejobb/" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/icons/insta.svg" /></a>
                    </div>
                </div>
                <div className="group-details">
                    <div className="details2">
                        <p className="title">Company</p>
                        <p><a href="https://www.swipejobb.se/en/" target="_blank" rel="noopener noreferrer" >About</a></p>
                        <p><a href="https://www.swipejobb.se/en/aboutUs/contact" target="_blank" rel="noopener noreferrer">Contact</a></p>
                        <p><a href="https://www.swipejobb.se/en/aboutUs/workWithUs" target="_blank" rel="noopener noreferrer">Careers</a></p>
                        <p><a href="https://www.swipejobb.se/en/aboutUs/mission" target="_blank" rel="noopener noreferrer">Blog</a></p>
                    </div>
                    <div className="details3">
                        <p className="title">Legal</p>
                        <p><a href="https://www.swipejobb.se/en/privatePolicy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p>
                        <p><a href="https://www.swipejobb.se/en/termsAndConditions" target="_blank" rel="noopener noreferrer">Terms of Service</a></p>
                        <p><a href="https://www.swipejobb.se/en/cookies" target="_blank" rel="noopener noreferrer">Cookie Policy</a></p>
                    </div>

                </div>
            </div>
            <hr className="last-break" />
            <p className="trademark">© 2025 SwipeJobb. All rights reserved.</p>
        </div>
    );
};

export default Footer;
