import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        { withCredentials: true }
      );

      // ممكن تمسح ال localStorage أو أي context هنا إذا بدك
      localStorage.removeItem("userId");

      navigate("/"); // رجع المستخدم للـ Login
    } catch (error) {
      console.error("Logout error:", error);
      alert("فشل تسجيل الخروج.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
