import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
export default function Navbar2() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={` top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#121212]/90 backdrop-blur border-b border-neutral-800" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-white tracking-tight">
          Job<span className="text-blue-400">Plus</span>
        </a>

        {/* Navigation Links */}
{/* Navigation Links */}
<div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
    <Link to={"/user_home"}>Dashbaord</Link>
  <button onClick={() => scrollToSection("applications")} className="hover:text-white transition">
    Applications
  </button>
  <button onClick={() => scrollToSection("profile")} className="hover:text-white transition">
    Profile
  </button>
  <button onClick={() => scrollToSection("charts")} className="hover:text-white transition">
    Insights
  </button>
</div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <a href="/login"
            className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >Logout</a>

        </div>
      </div>
    </nav>
  );
}
