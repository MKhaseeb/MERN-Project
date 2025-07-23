import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      .post("http://localhost:8000/api/login", formData, { withCredentials: true })
      .then((res) => {
        setMessage("");
        setErrors({});

        // Redirect based on account type returned from backend
        if (res.data.accountType === "company") {
          navigate("/company_homepage");
        } else {
          navigate("/home");
        }
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
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

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

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Login
        </button>
      </form>
    </div>
  );
}
