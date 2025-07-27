import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
export default function Navbar() {
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
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-[#121212]/90 backdrop-blur border-b border-neutral-800" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-white tracking-tight">
          Job<span className="text-blue-400">Plus</span>
        </a>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-300">
          <button onClick={() => scrollToSection("section1")} className="hover:text-white transition">Home</button>
          <button onClick={() => scrollToSection("section2")} className="hover:text-white transition">Features</button>
          <button onClick={() => scrollToSection("section3")} className="hover:text-white transition">Stats</button>
          <button onClick={() => scrollToSection("section4")} className="hover:text-white transition">Contact</button>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <a href="/login"
            className="px-4 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >Login</a>
          <a
            href="/register"
            className="px-4 py-1.5 text-sm rounded-md border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
}
