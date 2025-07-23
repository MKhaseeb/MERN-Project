import React, { useState } from 'react';
import axios from 'axios';

const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    phonenumber: '',
    details: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.phonenumber.trim()) newErrors.phonenumber = "Phone number is required";
    if (!formData.details.trim()) newErrors.details = "Details are required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
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
      .then(() => {
        setSuccess('✅ Company registered successfully!');
        setFormData({
          companyName: '',
          phonenumber: '',
          details: '',
          address: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
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
        <div>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName}</p>}
        </div>

        <div>
          <input
            type="text"
            name="phonenumber"
            placeholder="Phone Number"
            value={formData.phonenumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.phonenumber && <p className="text-red-500 text-sm">{errors.phonenumber}</p>}
        </div>

        <div>
          <input
            type="text"
            name="details"
            placeholder="Company Details"
            value={formData.details}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.details && <p className="text-red-500 text-sm">{errors.details}</p>}
        </div>

        <div>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register Company
        </button>
      </form>
    </div>
  );
};

export default CompanyRegister;
