import { useState, useRef, useEffect } from "react";
import '../styles/DropDownFooter.css';

export default function DropDownFooter({ label, options, icon, value, onChange }) {
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
        <div className="dropdown-wrapper-foot" ref={dropdownRef}>
            <span className="left-icon-foot">{icon}</span>
            <div className={`dropdown-header-foot ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <span>{value || label}</span>
                <span className={`right-icon ${open ? "rotate" : ""}`}> <img src="/assets/icons/drop3.svg" alt="arrow" /></span>
            </div>

            {open && (
                <div className="dropdown-menu-foot">
                    {options.map((option) => (
                        <div
                            key={option}
                            className="dropdown-item-foot"
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
