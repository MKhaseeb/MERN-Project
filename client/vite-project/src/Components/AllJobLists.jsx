// src/components/JobList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AllJobLists() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/api/jobs", { withCredentials: true })
            .then(res => setJobs(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load job listings");
            });
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-4">Job Listings</h2>
            {error && <p className="text-red-500">{error}</p>}
            {jobs.length === 0 ? (
                <p>No job listings available.</p>
            ) : (
                <ul className="space-y-4">
                    {jobs.map((job) => (
                        <li key={job._id} className="p-4 border rounded shadow">
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <p className="text-gray-600">{job.description}</p>
                            <p className="text-sm text-gray-500">
                                Location: {job.location} | Posted: {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
