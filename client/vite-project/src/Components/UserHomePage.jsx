import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export const UserHomePage = () => {
    const [applications, setApplications] = useState([]);
    const location = useLocation();
    const userId = location.state?.userId || localStorage.getItem("userId");

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:8000/api/jobs/user/${userId}/applications`, { withCredentials: true })
                .then(res => setApplications(res.data))
                .catch(err => console.error("Failed to load user applications", err));
        }
    }, [userId]);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">🗂 My Job Applications</h2>
            {applications.length > 0 ? (
                <ul className="space-y-4">
                    {applications.map(app => (
                        <li key={app.jobId} className="p-4 border rounded shadow-sm">
                            <h4 className="text-lg font-bold">{app.title}</h4>
                            <p><strong>Company:</strong> {app.company}</p>
                            <p><strong>Applied At:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>📭 You haven't applied to any jobs yet.</p>
            )}
        </div>
    );
};
