import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:8000/api/logout",
                {},
                { withCredentials: true }
            );

            localStorage.removeItem("userId");

            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            alert("فشل تسجيل الخروج.");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 w-full rounded-xl hover:bg-red-600 transition duration-200"
        >
            <FaSignOutAlt />
             Logout
        </button>
    );

}
