import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');

        const clientErrors = validateForm();
        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        axios
            .post('http://localhost:8000/api/company/register', formData, { withCredentials: true })
            .then((res) => {
                const companyId = res.data._id || res.data.company?._id;
                if (setCompanyId && companyId) {
                    setCompanyId(companyId); // Store in state/context
                }
                localStorage.setItem("companyId", res.data._id);
                navigate("/company_home", { state: { companyId: res.data._id } })
                setSuccess('✅ Company registered successfully!');
            })
            .catch(err => {
                if (err.response?.data?.errors) {
                    const errorObj = {};
                    for (let key in err.response.data.errors) {
                        errorObj[key] = err.response.data.errors[key].message;
                    }
                    setErrors(errorObj);
                } else {
                    setErrors({ general: "Something went wrong!" });
                }
            });
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-8 shadow-xl rounded-xl bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Register Your Company</h2>

            {success && <p className="text-green-600 text-center mb-4">{success}</p>}
            {errors.general && <p className="text-red-600 text-center mb-4">{errors.general}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full border rounded p-2" />
                {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}

                <input type="text" name="phonenumber" placeholder="Phone Number" value={formData.phonenumber} onChange={handleChange} className="w-full border rounded p-2" />
                {errors.phonenumber && <p className="text-red-500 text-sm">{errors.phonenumber}</p>}

                <input type="text" name="details" placeholder="Company Details" value={formData.details} onChange={handleChange} className="w-full border rounded p-2" />
                {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input type="text" name="country" placeholder="Country" value={formData.address.country} onChange={handleChange} className="w-full border rounded p-2" />
                    <input type="text" name="city" placeholder="City" value={formData.address.city} onChange={handleChange} className="w-full border rounded p-2" />
                    <input type="text" name="street" placeholder="Street" value={formData.address.street} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                {(errors.country || errors.city || errors.street) && (
                    <div className="text-red-500 text-sm space-y-1">
                        {errors.country && <p>{errors.country}</p>}
                        {errors.city && <p>{errors.city}</p>}
                        {errors.street && <p>{errors.street}</p>}
                    </div>
                )}

                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full border rounded p-2" />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full border rounded p-2" />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Register Company
                </button>
            </form>
        </div>
    );
};

export default CompanyRegister;
