import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const UserHomePage = () => {
  const [applications, setApplications] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]); // Placeholder for jobs user hasn't applied to
  const [userInfo, setUserInfo] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8000/api/jobs/user/${userId}/applications`, { withCredentials: true })
        .then(res => setApplications(res.data))
        .catch(err => console.error("Failed to load applications", err));

      // FRONTEND ONLY - Needs a new endpoint to fetch user info
      setUserInfo({
        firstName: "Loading...",
        lastName: "",
        email: ""
      });

      // FRONTEND ONLY - Needs backend endpoint for non-applied jobs
      setAvailableJobs([
        {
          _id: "placeholder",
          title: "Frontend Developer",
          location: "Gaza",
          salaryRange: "$1000 - $2000",
        },
      ]);
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#0f1214] text-white p-6">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">👤 Welcome to Your Dashboard</h2>

      {/* Profile Info */}
      <div className="bg-[#161a1d] p-4 rounded-xl border border-gray-700 mb-6">
        <h3 className="text-xl font-semibold mb-2">👨‍💼 Profile</h3>
        {userInfo ? (
          <ul className="text-gray-300">
            <li><strong>Name:</strong> {userInfo.firstName} {userInfo.lastName}</li>
            <li><strong>Email:</strong> {userInfo.email}</li>
          </ul>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>

      {/* Applications Section */}
      <div className="bg-[#161a1d] p-4 rounded-xl border border-gray-700 mb-6">
        <h3 className="text-xl font-semibold mb-2">📄 My Job Applications</h3>
        {applications.length > 0 ? (
          <ul className="space-y-4">
            {applications.map((app, idx) => (
              <li key={idx} className="p-3 border border-gray-600 rounded">
                <p><strong>Position:</strong> {app.title}</p>
                <p><strong>Company:</strong> {app.company}</p>
                <p><strong>Date:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>📭 No applications found.</p>
        )}
      </div>

      {/* Available Jobs Section - FRONTEND ONLY */}
      <div className="bg-[#161a1d] p-4 rounded-xl border border-gray-700 mb-6">
        <h3 className="text-xl font-semibold mb-2">🧭 Explore New Jobs</h3>
        {availableJobs.length > 0 ? (
          <ul className="grid md:grid-cols-2 gap-4">
            {availableJobs.map(job => (
              <li key={job._id} className="p-3 border border-gray-600 rounded">
                <h4 className="font-bold text-white text-lg">{job.title}</h4>
                <p className="text-gray-400">📍 {job.location}</p>
                <p className="text-gray-400">💰 {job.salaryRange}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Apply</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>✨ No new jobs right now.</p>
        )}
      </div>
    </div>
  );
};
