import { useState } from "react";
import {
    Home,
    Settings,
    User,
    Menu,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

const menuItems = [
    {
        icon: <Home />,
        label: "Home",
        submenu: null,
    },
    {
        icon: <User />,
        label: "Profile",
        submenu: ["Edit Profile", "Activity", "Security"],
    },
    {
        icon: <Settings />,
        label: "Settings",
        submenu: ["General", "Notifications", "Appearance"],
    },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const toggleSubmenu = (index) => {
        setOpenSubmenu(openSubmenu === index ? null : index);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`${isOpen ? "w-64" : "w-16"
                    } bg-gray-900 text-white duration-300 relative`}
            >
                {/* Toggle Button */}
                <button
                    className={`absolute -right-3 top-5 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Menu size={16} className="text-gray-900" />
                </button>

                {/* Menu Items */}
                <div className="mt-16 flex flex-col gap-2">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                            <div
                                className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-700 rounded-md relative group"
                                onClick={() => item.submenu && toggleSubmenu(index)}
                            >
                                {item.icon}

                                {/* Menu Label */}
                                <span
                                    className={`origin-left duration-300 ${isOpen ? "opacity-100" : "opacity-0 absolute left-14 bg-gray-800 px-2 py-1 rounded shadow-lg group-hover:opacity-100"
                                        }`}
                                >
                                    {item.label}
                                </span>

                                {/* Submenu Toggle Icon */}
                                {item.submenu && isOpen && (
                                    <span className="ml-auto">
                                        {openSubmenu === index ? <ChevronDown /> : <ChevronRight />}
                                    </span>
                                )}
                            </div>

                            {/* Submenu Items */}
                            {item.submenu && openSubmenu === index && (
                                <div className="flex flex-col ml-10 mt-1">
                                    {item.submenu.map((sub, subIndex) => (
                                        <div
                                            key={subIndex}
                                            className="text-gray-300 hover:text-white p-1 cursor-pointer rounded-md hover:bg-gray-700"
                                        >
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100 p-10">
                <h1 className="text-2xl font-bold">Main Content Area</h1>
                <p className="mt-4">Click on sidebar items to see submenus.</p>
            </div>
        </div>
    );
}
