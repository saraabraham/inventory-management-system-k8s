import '../styles/HRCard.css';
import StarRating from "../components/StarRating";
import StarRating2 from '../components/StarRating2';
import { useState } from 'react';

const HRCard = ({ data }) => {
    const { initials, name, title, company, rating, reviews, location, country, experience, skills, price } = data;
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleUnlock = () => {
        setIsUnlocked(true);
    };

    const handleConnect = () => {
        setIsConnected(true);
    };

    return (
        <div className="hr-card-wrapper">
            <div className="overlay-icon">{isUnlocked && <button onClick={handleConnect}><img src="/assets/icons/lock2.svg" /> Click to unlock</button>}</div>
            {!isConnected && (<div className={`hr-card ${isUnlocked ? "blurred" : ""}`}>
                <div className="hr-card-header">
                    <p className="initials">{initials}</p>
                    <div className="card-header">
                        <h3>{initials}</h3>
                        <p>{title}</p>
                        <p>{company}</p>
                        <div className="rating-row">
                            <StarRating rating={rating} />
                            <span className="rating-value">{rating}</span>
                            <span className="review-count">({reviews} reviews)</span>
                        </div>
                    </div>
                    <p className="cost">€{price}</p>

                </div>
                <div className="hr-card-body">
                    <p>{location}</p>
                    <p>{experience}</p>
                    {skills && skills.length > 0 && (
                        <div className="skills">
                            {skills.map((skill, index) => (
                                <span key={index} className="skill">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                </div>
                {!isUnlocked && <button className="unlock" onClick={handleUnlock}><img src="/assets/icons/lock.svg"></img>Unlock to Connect</button>}


            </div>)}

            {isConnected && (
                <div className="new-connection-overlay">
                    <div className="new-connection">
                        <div className="new-connection-header">
                            <h3>Connect with {name}</h3>
                            <button className="closeBtn2" onClick={() => setIsConnected(false)}><img src="/assets/icons/closePop.svg" className="closeImg"></img></button>
                        </div>
                        <div className="new-connection-body">
                            <div>
                                <div className="hr-card-header2">
                                    <p className="initials">{initials}</p>
                                    <div className="card-header2">
                                        <h3>{name}</h3>
                                        <p className="subtitle">{title}</p>
                                        <p className="subtitle">{company}</p>
                                        <div className="rating-row2">
                                            <StarRating2 rating={rating} />
                                            <span className="rating-value">{rating}/5</span>
                                        </div>
                                    </div>
                                    <p className="cost2">€4.99</p>
                                </div>
                                <p className="titles">Upload CV (Optional)</p>
                                <div className="upload-file">
                                    <img src="/assets/icons/uploadFile.svg"></img>
                                    <p>Choose file or drag & drop <span>PDF, DOC, DOCX up to 10MB</span></p>
                                </div>
                                <div>

                                </div>
                                <p className="titles">Message to {name}</p>
                                <div>
                                    <textarea className="message" placeholder="Tell them about your background, goals, and what you're looking for help with…"></textarea>
                                </div>
                                <div className="HR-Footer">
                                    <div className="HR-Footer-Header">
                                        <p>Connection Fee</p>
                                        <h3>€4.99</h3>
                                    </div>
                                    <p className="secure-payment"><img src="/assets/icons/secure.svg"></img>Secure payment • Full refund if not satisfied</p>
                                    <p className="secure-payment-fees">This fee includes a 30-minute consultation and ongoing support for your career questions.</p>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            )
            }
        </div>

    );
};

export default HRCard;
