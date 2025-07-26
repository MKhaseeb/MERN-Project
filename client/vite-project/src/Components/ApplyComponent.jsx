import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaPaperclip, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios"
export default function ApplyComponent() {
    const { id } = useParams(); // Get the ID from the URL
    const { state } = useLocation(); // Get the job data from state passed via the Link component (if passed)

    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        coverLetter: "",
        cv: null,
    });

    // Fetch job data from the server if not passed through state
    useEffect(() => {
        if (!state?.job) {
            axios.get(`http://localhost:8000/api/jobs/${id}`)
                .then((res) => setJob(res.data))
                .catch((err) => console.error(err));
        } else {
            setJob(state.job); // If job is passed via state, use it directly
        }
    }, [id, state]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            cv: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first.");
            return;
        }

        const form = new FormData();
        form.append("coverLetter", formData.coverLetter);
        form.append("cv", formData.cv);

        try {
            await axios.post(
                `http://localhost:8000/api/jobs/${job._id}/apply`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                }
            );
            alert("✅ Application submitted!");
        } catch (err) {
            console.error("❌ Failed to submit:", err.response?.data || err.message);
            alert(err?.response?.data?.message || "Error while submitting application");
        }
    };

    if (!job) {
        return <div>Loading...</div>; // Show a loading message if job data is not available
    }

    return (
        <div className="min-h-screen bg-[#0f1214] text-white">
            {/* Navbar */}
            <nav className="bg-[#0f1214] border-b border-gray-800 px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold tracking-wide text-white">Job Plus</h1>
            </nav>

            {/* Job Application Section */}
            <div className="flex px-6 py-8 gap-6 max-w-7xl mx-auto">
                {/* Left Side: Application Form */}
                <div className="w-2/5 space-y-4 bg-[#161a1d] p-6 rounded-lg border border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-bold text-white">Apply Now</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 rounded bg-[#161a1d] text-white border border-gray-700"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400">Email</label>
                                <input
                                    type="email"
                                    className="w-full mt-2 px-4 py-2 rounded bg-[#161a1d] text-white border border-gray-700"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400">Cover Letter</label>
                                <textarea
                                    className="w-full mt-2 px-4 py-2 rounded bg-[#161a1d] text-white border border-gray-700"
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    rows={6}
                                    placeholder="Tell us why you're a great fit for this position"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-gray-400">Upload CV</label>
                                <div className="flex items-center mt-2 px-4 py-2 bg-[#161a1d] border border-gray-700 rounded">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="w-full text-white bg-transparent"
                                        required
                                    />
                                    <FaPaperclip className="text-blue-400" />
                                    {formData.cv && <span className="ml-2 text-gray-400">{formData.cv.name}</span>}
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Job Details */}
                <div className="w-3/5 bg-[#161a1d] p-8 rounded-lg border border-gray-800 shadow-xl sticky top-8">
                    <h2 className="text-3xl font-bold text-white mb-1">{job.title}</h2>
                    <p className="text-gray-400">{job.company?.name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span><FaMapMarkerAlt className="inline mr-1 text-blue-400" />{job.location}</span>
                        <span><FaCalendarAlt className="inline mr-1 text-purple-400" />{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-white font-semibold mb-1">Salary Range</h3>
                        <p className="text-gray-400">{job.salaryRange}</p>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-white font-semibold mb-1">Job Description</h3>
                        <p className="text-gray-400 whitespace-pre-line">{job.description}</p>
                    </div>

                    <div className="border-t border-gray-700 pt-4">
                        <h3 className="text-white font-semibold mb-1">Requirements</h3>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                            {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
