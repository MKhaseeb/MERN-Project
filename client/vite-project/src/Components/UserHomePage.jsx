// UserDashboard.jsx - Multi-Page View: Adds Dynamic Profile Page with Edit Support
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaSignOutAlt, FaBookmark, FaBriefcase, FaBell } from "react-icons/fa";

const colors = {
  bg: "#0f1214",
  card: "#161a1d",
  grid: "#2c343c",
  sidebar: "#1c1f23",
  primary: "#3b82f6",
  chartFill: "#3b82f655",
};

const Sidebar = ({ active, onChange }) => (
  <div className="h-screen w-64 bg-[#1c1f23] text-white p-6 flex flex-col justify-between fixed left-0 top-0">
    <div className="space-y-4">
      <h1 className="text-xl font-bold mb-6">Job Plus</h1>
      {[
        { icon: <FaUser />, label: "Profile", key: "profile" },
        { icon: <FaBriefcase />, label: "Applications", key: "applications" },
        { icon: <FaBookmark />, label: "Saved Jobs", key: "saved" },
        { icon: <FaBell />, label: "Notifications", key: "notifications" },
      ].map(({ icon, label, key }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 p-3 w-full rounded-xl transition duration-200 ${
            active === key ? "bg-[#161a1d]" : "hover:bg-[#2c343c]"
          }`}
        >
          {icon} {label}
        </button>
      ))}
    </div>
    <button className="flex items-center gap-2 p-3 w-full rounded-xl hover:bg-red-600 transition duration-200">
      <FaSignOutAlt /> Logout
    </button>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-[#161a1d] text-white p-5 rounded-2xl shadow-md border border-[#2c343c]">
    <h2 className="text-lg font-semibold mb-1 text-gray-300">{title}</h2>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const UserHomePage = () => {
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("applications");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8000/api/jobs/user/${userId}/applications`, { withCredentials: true })
        .then(res => setApplications(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error("Failed to load applications", err));

      axios.get(`http://localhost:8000/api/users/${userId}`, { withCredentials: true })
        .then(res => {
          setUser(res.data);
          setFormData({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
          });
        })
        .catch(err => console.error("Failed to load user info", err));
    }
  }, [userId]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSave = () => {
    axios.put(`http://localhost:8000/api/users/${userId}`, formData, { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setEditing(false);
      })
      .catch(err => console.error("Failed to update profile", err));
  };

  const statCounts = {
    totalApplications: applications.length || 0,
    interviews: 0,
    saved: 0,
    profileProgress: user ? "80%" : "--",
  };

  return (
    <div className="bg-[#0f1214] min-h-screen pl-64">
      <Sidebar active={page} onChange={setPage} />
      <main className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-6">Welcome back {user?.firstName || "👋"}</h1>

        {page === "applications" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Applications" value={statCounts.totalApplications} />
              <StatCard title="Interviews" value={statCounts.interviews} />
              <StatCard title="Saved Jobs" value={statCounts.saved} />
              <StatCard title="Profile Completeness" value={statCounts.profileProgress} />
            </div>

            <div className="bg-[#161a1d] p-6 rounded-2xl shadow border border-[#2c343c] mb-6">
              <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1c1f23] text-gray-300">
                  <tr>
                    <th className="py-2 px-4">Job Title</th>
                    <th className="py-2 px-4">Company</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Applied At</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-3 px-4 text-center text-gray-400">
                        No applications found.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-[#2c343c] hover:bg-[#2c343c]"
                      >
                        <td className="py-3 px-4">{app.title}</td>
                        <td className="py-3 px-4">{app.company}</td>
                        <td className="py-3 px-4 text-blue-400">Submitted</td>
                        <td className="py-3 px-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {page === "profile" && (
          <div className="bg-[#161a1d] p-6 rounded-2xl shadow border border-[#2c343c]">
            <h2 className="text-xl font-semibold mb-4">My Profile</h2>
            {user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1">First Name</label>
                    <input
                      className="w-full bg-[#1c1f23] p-2 rounded-xl border border-[#2c343c] text-white"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-1">Last Name</label>
                    <input
                      className="w-full bg-[#1c1f23] p-2 rounded-xl border border-[#2c343c] text-white"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 mb-1">Email</label>
                    <input
                      className="w-full bg-[#1c1f23] p-2 rounded-xl border border-[#2c343c] text-white"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                      Edit
                    </button>
                  ) : (
                    <>
                      <button onClick={handleProfileSave} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                        Save
                      </button>
                      <button onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Loading user info...</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserHomePage;