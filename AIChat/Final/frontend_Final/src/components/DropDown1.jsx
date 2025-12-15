import { useState, useRef, useEffect } from "react";
import '../styles/DropDown1.css';
import countries from "../data/countries";

export default function Dropdown1({ label, icon, value, onChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);


    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="dropdown-wrapper-country" ref={dropdownRef}>
            <div
                className={`dropdown-header1 ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
            >
                {/* If the selected value exists, show flag + name */}
                {value ? (
                    <span>
                        {countries.find(c => c.name === value)?.emoji}{" "}
                        {value}
                    </span>
                ) : (
                    <span>{label}</span>
                )}

                <span className={`right-icon1 ${open ? "rotate" : ""}`}>
                    <img src="/assets/icons/countryDropDown.svg" alt="arrow" />
                </span>
            </div>

            {open && (
                <div className="dropdown-menu1">
                    {countries.map((country) => (
                        <div
                            key={country.name}
                            className="dropdown-item1"
                            onClick={() => {
                                onChange(country.name); // return selected country name
                                setOpen(false);
                            }}
                        >
                            {country.emoji} {country.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
