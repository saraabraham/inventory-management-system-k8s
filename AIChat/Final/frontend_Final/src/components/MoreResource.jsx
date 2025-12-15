import React, { useRef, useState } from "react";
import moreResourceCards from "../data/moreResourceData";
import "../styles/MoreResource.css";

const MoreResource = () => {
    const [showMore, setShowMore] = useState(false);
    const wrapperRef = useRef();

    const toggleShowMore = () => {
        setShowMore(prev => !prev);
    };

    return (
        <div className="MoreResource">
            <h2>Explore More Career Resources</h2>
            <h3>Discover tools and opportunities to advance your career</h3>
            <div
                ref={wrapperRef}
                className={`career-resources-wrapper ${showMore ? "show-more-active" : ""}`}
            >
                {moreResourceCards.map((card, index) => (
                    <div className="card" key={index}>
                        <div className="card-img"><img src={card.img} alt={card.title} /></div>
                        <h2>{card.title}</h2>
                        <ul>
                            {card.items.map((item, idx) => (
                                <li key={idx}>
                                    {index === 0 ? <a href="#">{item.title}</a> : item.title}
                                    <p>{item.desc}</p>
                                </li>
                            ))}
                        </ul>
                        <button>{card.btn}</button>
                    </div>
                ))}
            </div>

            <button className="show-more-btn" onClick={toggleShowMore}>
                {showMore ? "Show Less" : "Show More"}
            </button>
        </div>
    );
};

export default MoreResource;
