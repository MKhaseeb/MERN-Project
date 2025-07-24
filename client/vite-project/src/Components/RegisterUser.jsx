import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8000/api/register", formData, { withCredentials: true })
      .then((res) => {
        const userId = res.data._id || res.data.user?._id;

        if (setUserId && userId) {
          setUserId(userId); // Store in context/state
        }

        localStorage.setItem("userId", userId); // Optional: also save to localStorage
        setMessage("");
        setErrors({});
        navigate("/user_home", { state: { userId } }); // Optional: pass via route state
      })
      .catch((err) => {
        const errData = err.response?.data;
        if (errData?.errors) {
          setErrors(errData.errors);
        } else if (errData?.message) {
          setMessage(errData.message);
        } else {
          setMessage("Something went wrong.");
        }
      });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-xl rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      {message && <div className="text-red-500 mb-4 text-center">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>

        <div>
          <label>Last Name</label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>

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

        <div>
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Register
        </button>
      </form>
    </div>
  );
}
