import { useState, useRef, useEffect } from "react";
import '../styles/DropDown2.css';

export default function Dropdown2({ label, options, icon, value, onChange }) {
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
        <div className="dropdown-wrapper-help" ref={dropdownRef}>
            <div className={`dropdown-header2 ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <span>{value || label}</span>
                <span className={`right-icon2 ${open ? "rotate" : ""}`}> <img src="/assets/icons/countryDropDown.svg" alt="arrow" /></span>
            </div>

            {open && (
                <div className="dropdown-menu2">
                    {options.map((option) => (
                        <div
                            key={option}
                            className="dropdown-item2"
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
