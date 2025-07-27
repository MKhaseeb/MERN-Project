import { useState } from "react";
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

export default function LoginComponent() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.post("http://localhost:8000/api/login", formData, {
                withCredentials: true,
            });

            const { accountType, userId, token, firstName, lastName, email } = res.data;

            // Store user info
            localStorage.setItem("userId", userId);
            localStorage.setItem("accountType", accountType);
            localStorage.setItem("token", token);
            const safeFullName = `${firstName || ""} ${lastName || ""}`.trim();

            localStorage.setItem("user", JSON.stringify({
                fullName: safeFullName,
                email: email || "",
            }));

            if (accountType === "company") {
                navigate("/company_homepage", { state: { userId } });
            } else {
                navigate("/alljobs", { state: { userId } });
            }
        } catch (err) {
            const errData = err.response?.data;
            if (errData?.errors) setErrors(errData.errors);
            else setMessage(errData?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

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
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to your account to continue</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="p-8 rounded-2xl shadow-2xl border" style={{ backgroundColor: colors.card, borderColor: colors.grid }}>
                        {message && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-red-400 text-center text-sm">{message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                    style={{
                                        backgroundColor: colors.sidebar,
                                        borderColor: colors.grid,
                                        focusRingColor: colors.primary
                                    }}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                                {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-4 pr-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                        style={{
                                            backgroundColor: colors.sidebar,
                                            borderColor: colors.grid,
                                            focusRingColor: colors.primary
                                        }}
                                        placeholder="Enter your password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: colors.primary, focusRingColor: colors.primary }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Signing In...
                                    </div>
                                ) : (
                                    'Sign In'
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
                                    <span className="px-4 text-gray-400" style={{ backgroundColor: colors.card }}>Or</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-gray-300 hover:text-white"
                                    style={{ borderColor: colors.grid, backgroundColor: colors.sidebar }}
                                >
                                    Create Account
                                </Link>
                                <Link
                                    to="/login_company"
                                    className="flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-gray-300 hover:text-white"
                                    style={{ borderColor: colors.grid, backgroundColor: colors.sidebar }}
                                >
                                    Company Login
                                </Link>
                            </div>

                            <div className="text-center">
                                <Link
                                    to="/register_company"
                                    className="text-sm hover:underline transition-colors duration-200"
                                    style={{ color: colors.primary }}
                                >
                                    Register your company
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}