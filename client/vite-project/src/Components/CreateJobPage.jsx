import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateJobPage = () => {
    const navigate = useNavigate();
    const [job, setJob] = useState({
        title: '',
        description: '',
        location: '',
        salaryRange: '',
        requirements: ''
    });

    const companyId = localStorage.getItem("companyId");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/jobs', {
                ...job,
                company: companyId,
                requirements: job.requirements.split(',').map(r => r.trim())
            }, { withCredentials: true });
            navigate('/company_home');
        } catch (err) {
            alert("❌ Failed to create job");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1214] text-white px-6 py-10 flex items-center justify-center">
            <div className="bg-[#161a1d] p-8 rounded-xl shadow border border-gray-700 max-w-2xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">📄 Create a Job Listing</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Job Title"
                        className="w-full p-3 rounded bg-[#1e2328] border border-gray-700 text-white"
                        value={job.title}
                        onChange={e => setJob({ ...job, title: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Description (use bullet points with - or *)"
                        rows={5}
                        className="w-full p-3 rounded bg-[#1e2328] border border-gray-700 text-white whitespace-pre-line"
                        value={job.description}
                        onChange={e => setJob({ ...job, description: e.target.value })}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-3 rounded bg-[#1e2328] border border-gray-700 text-white"
                        value={job.location}
                        onChange={e => setJob({ ...job, location: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Salary Range (e.g., $60,000 - $90,000)"
                        className="w-full p-3 rounded bg-[#1e2328] border border-gray-700 text-white"
                        value={job.salaryRange}
                        onChange={e => setJob({ ...job, salaryRange: e.target.value })}
                    />

                    <input
                        type="text"
                        placeholder="Requirements (comma-separated)"
                        className="w-full p-3 rounded bg-[#1e2328] border border-gray-700 text-white"
                        value={job.requirements}
                        onChange={e => setJob({ ...job, requirements: e.target.value })}
                    />

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                    >
                        ✅ Post Job
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateJobPage;