import { useState, useRef, useEffect } from "react";
import '../styles/DropDown.css';

export default function DropDown({ label, options, icon, value, onChange }) {
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
        <div className="dropdown-wrapper" ref={dropdownRef}>
            <span className="left-icon">{icon}</span>
            <div className={`dropdown-header ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <span>{value || label}</span>
                <span className={`right-icon ${open ? "rotate" : ""}`}> <img src="/assets/icons/drop2.svg" alt="arrow" /></span>
            </div>

            {open && (
                <div className="dropdown-menu">
                    {options.map((option) => (
                        <div
                            key={option}
                            className="dropdown-item"
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
