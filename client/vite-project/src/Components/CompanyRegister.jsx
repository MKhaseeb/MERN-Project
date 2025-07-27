import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBuilding, FaEye, FaEyeSlash } from 'react-icons/fa';

const colors = {
    bg: "#0f1214",
    card: "#161a1d",
    grid: "#2c343c",
    sidebar: "#1c1f23",
    primary: "#3b82f6",
};

const CompanyRegister = ({ setCompanyId }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        companyName: '',
        phonenumber: '',
        details: '',
        address: {
            country: '',
            city: '',
            street: ''
        },
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (['country', 'city', 'street'].includes(name)) {
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [name]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
        if (!formData.phonenumber.trim()) newErrors.phonenumber = "Phone number is required";
        if (!formData.details.trim()) newErrors.details = "Details are required";
        if (!formData.address.country.trim()) newErrors.country = "Country is required";
        if (!formData.address.city.trim()) newErrors.city = "City is required";
        if (!formData.address.street.trim()) newErrors.street = "Street is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');
        setIsLoading(true);

        const clientErrors = validateForm();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            setIsLoading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:8000/api/company/register', formData, { withCredentials: true });
            const companyId = res.data._id || res.data.company?._id;
            if (setCompanyId && companyId) {
                setCompanyId(companyId);
            }
            localStorage.setItem("companyId", res.data._id);
            navigate("/company_home", { state: { companyId: res.data._id } });
            setSuccess('✅ Company registered successfully!');
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorObj = {};
                for (let key in err.response.data.errors) {
                    errorObj[key] = err.response.data.errors[key].message;
                }
                setErrors(errorObj);
            } else {
                setErrors({ general: "Something went wrong!" });
            }
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
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: colors.primary }}>
                            <FaBuilding className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">Register Your Company</h1>
                        <p className="text-gray-400">Join our platform and start posting jobs today</p>
                    </div>

                    {/* Main Form Card */}
                    <div className="p-8 rounded-2xl shadow-2xl border" style={{ backgroundColor: colors.card, borderColor: colors.grid }}>
                        {success && (
                            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                <p className="text-green-400 text-center text-sm">{success}</p>
                            </div>
                        )}
                        {errors.general && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-red-400 text-center text-sm">{errors.general}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Company Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        placeholder="Enter company name"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                        style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                    />
                                    {errors.companyName && <p className="text-red-400 text-sm mt-2">{errors.companyName}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        placeholder="Enter phone number"
                                        value={formData.phonenumber}
                                        onChange={handleChange}
                                        className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                        style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                    />
                                    {errors.phonenumber && <p className="text-red-400 text-sm mt-2">{errors.phonenumber}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Company Details</label>
                                <textarea
                                    name="details"
                                    placeholder="Describe your company"
                                    value={formData.details}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500 resize-none"
                                    style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                />
                                {errors.details && <p className="text-red-400 text-sm mt-2">{errors.details}</p>}
                            </div>

                            {/* Address Information */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-3">Address</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            name="country"
                                            placeholder="Country"
                                            value={formData.address.country}
                                            onChange={handleChange}
                                            className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                            style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={formData.address.city}
                                            onChange={handleChange}
                                            className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                            style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="street"
                                            placeholder="Street"
                                            value={formData.address.street}
                                            onChange={handleChange}
                                            className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                            style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                        />
                                    </div>
                                </div>
                                {(errors.country || errors.city || errors.street) && (
                                    <div className="mt-2 space-y-1">
                                        {errors.country && <p className="text-red-400 text-sm">{errors.country}</p>}
                                        {errors.city && <p className="text-red-400 text-sm">{errors.city}</p>}
                                        {errors.street && <p className="text-red-400 text-sm">{errors.street}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Account Information */}
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter company email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                    style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                />
                                {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Create password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full p-4 pr-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                            style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full p-4 pr-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-white placeholder-gray-500"
                                            style={{ backgroundColor: colors.sidebar, borderColor: colors.grid }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>}
                                </div>
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
                                    'Register Company'
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
                                    to="/login_company"
                                    className="flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-gray-300 hover:text-white"
                                    style={{ borderColor: colors.grid, backgroundColor: colors.sidebar }}
                                >
                                    Company Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] text-gray-300 hover:text-white"
                                    style={{ borderColor: colors.grid, backgroundColor: colors.sidebar }}
                                >
                                    User Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


export default CompanyRegister;