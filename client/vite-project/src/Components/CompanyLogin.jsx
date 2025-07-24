import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CompanyLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8000/api/company/login', formData, { withCredentials: true })
            .then((res) => {
                setMessage('');
                setErrors({});

                const companyId = res.data.companyId;
                if (companyId) {
                    localStorage.setItem('companyId', companyId);
                    navigate('/company_home', { state: { companyId } });
                } else {
                    setMessage('Login succeeded but company ID missing.');
                }
            })
            .catch((err) => {
                const errData = err.response?.data;
                if (errData?.errors) {
                    setErrors(errData.errors);
                } else if (errData?.message) {
                    setMessage(errData.message);
                } else {
                    setMessage('Something went wrong.');
                }
            });
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-xl rounded-xl bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Company Login</h2>

            {message && <div className="text-red-500 mb-4 text-center">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
