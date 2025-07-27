import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';

const colors = {
  bg: "#0f1214",
  card: "#161a1d",
  grid: "#2c343c",
  sidebar: "#1c1f23",
  primary: "#3b82f6",
};

export default function RegisterUser({ setUserId }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/register", formData, { withCredentials: true });
      const userId = res.data._id || res.data.user?._id;

      if (setUserId && userId) setUserId(userId);
      localStorage.setItem("userId", userId);
      setMessage("");
      setErrors({});
      navigate("/user_home", { state: { userId } });
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.errors) {
        setErrors(errData.errors);
      } else if (errData?.message) {
        setMessage(errData.message);
      } else {
        setMessage("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    gsap.set(containerRef.current, { xPercent: 100, opacity: 0 });
    gsap.to(containerRef.current, {
      xPercent: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const Input = (label, name, type = "text", placeholder = "") => (
    <div className="w-full">
      <label className="block text-gray-300 text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <input
          type={
            name === "password" ? (showPassword ? "text" : "password") :
              name === "confirmPassword" ? (showConfirmPassword ? "text" : "password") :
                type
          }
          name={name}
          value={formData[name]}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
          style={{
            backgroundColor: colors.sidebar,
            borderColor: colors.grid,
            paddingRight: (name === "password" || name === "confirmPassword") ? "3rem" : "1rem"
          }}
          disabled={isLoading}
        />
        {name === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
        {name === "confirmPassword" && (
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-red-400 text-sm mt-2">{errors[name].message || errors[name]}</p>}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
        <div className="text-xl font-bold"><a href="/" className="hover:text-indigo-400">Jop Plus</a></div>
      </nav>
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.bg }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: colors.primary }}>
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join us today and start your journey</p>
          </div>

          {/* Main Form Card */}
          <div className="p-8 rounded-2xl shadow-2xl border" style={{ backgroundColor: colors.card, borderColor: colors.grid }}>
            {message && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-center text-sm">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div ref={containerRef} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Input("First Name", "firstName", "text", "Sarah")}
                  {Input("Last Name", "lastName", "text", "Smith")}
                </div>

                {Input("Email Address", "email", "email", "sarah@example.com")}
                {Input("Password", "password", "password", "Create a strong password")}
                {Input("Confirm Password", "confirmPassword", "password", "Confirm your password")}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Navigation Links */}
            <div className="mt-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: colors.grid }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-gray-400" style={{ backgroundColor: colors.card }}>Already have an account?</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/login"
                  className="flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-gray-300 hover:text-white"
                  style={{ borderColor: colors.grid, backgroundColor: colors.sidebar }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register_company"
                  className="flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-gray-300 hover:text-white"
                  style={{ borderColor: colors.grid, backgroundColor: colors.sidebar }}
                >
                  Company Register
                </Link>
              </div>

              <div className="text-center">
                <Link
                  to="/login_company"
                  className="text-sm hover:underline transition-colors duration-200"
                  style={{ color: colors.primary }}
                >
                  Have a company account? Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}