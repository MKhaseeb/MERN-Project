import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

export default function ApplyComponent() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        coverLetter: "",
        cv: null,
    });

    // Fetch user info from DB using userId + token
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (userId && token) {
            axios
                .get(`http://localhost:8000/api/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                })
                .then((res) => {
                    const { firstName, lastName, email } = res.data;
                    setFormData((prev) => ({
                        ...prev,
                        fullName: `${firstName || ""} ${lastName || ""}`.trim(),
                        email: email || "",
                    }));

                    // Optional: cache for reuse
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            fullName: `${firstName || ""} ${lastName || ""}`.trim(),
                            email: email || "",
                        })
                    );
                })
                .catch((err) => {
                    console.error("Failed to fetch user info:", err);
                });
        }
    }, []);

    // Load job details
    useEffect(() => {
        if (!state?.job) {
            axios
                .get(`http://localhost:8000/api/jobs/${id}`)
                .then((res) => setJob(res.data))
                .catch((err) => console.error(err));
        } else {
            setJob(state.job);
        }
    }, [id, state]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, cv: file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, email, coverLetter, cv } = formData;

        if (!fullName || !email || !coverLetter || !cv) {
            alert("Please complete all fields and upload your CV.");
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            alert("You must be logged in to apply.");
            return;
        }

        const data = new FormData();
        data.append("cv", cv);
        data.append("coverLetter", coverLetter);
        data.append("fullName", fullName);
        data.append("email", email);

        try {
            await axios.post(`http://localhost:8000/api/jobs/${id}/apply`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            alert("Application submitted successfully!");
            navigate("/user_home");
        } catch (error) {
            console.error("Application error:", error);
            alert("Failed to submit application.");


        }
    };

    if (!job) return <div className="text-white p-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0f1214] text-white">
            {/* Navbar */}
            <nav className="bg-[#0f1214] border-b border-gray-800 px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold tracking-wide text-white">Job Plus</h1>
            </nav>

            {/* Content */}
            <div className="flex px-6 py-8 gap-6 max-w-7xl mx-auto">
                {/* Left: Form */}
                <div className="w-2/5 space-y-4 bg-[#161a1d] p-6 rounded-lg border border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-bold text-white">Apply Now</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <input
                                    type="text"
                                    className="w-full mt-2 px-4 py-2 rounded-xl bg-[#20252a] text-gray-300 border border-gray-600 cursor-not-allowed"
                                    value={formData.fullName}
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="text-gray-400">Email</label>
                                <input
                                    type="email"
                                    className="w-full mt-2 px-4 py-2 rounded-xl bg-[#20252a] text-gray-300 border border-gray-600 cursor-not-allowed"
                                    value={formData.email}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Upload your CV (PDF or DOC)</label>
                                <div
                                    className="border-2 border-dashed border-gray-500 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 bg-[#1f252a] transition-colors"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-gray-300">
                                            {formData.cv ? (
                                                <span className="text-blue-400 font-medium">{formData.cv.name}</span>
                                            ) : (
                                                <>
                                                    <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
                                                </>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 10MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-400">Cover Letter</label>
                                <textarea
                                    className="w-full mt-2 px-4 py-2 rounded-xl bg-[#161a1d] text-white border border-gray-700 resize-none"
                                    value={formData.coverLetter}
                                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    rows={6}
                                    placeholder="Explain why you're a great fit for this position"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-lg"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right: Job Details */}
                <div className="w-3/5 bg-[#161a1d] p-8 rounded-lg border border-gray-800 shadow-xl sticky top-8">
                    <h2 className="text-3xl font-bold text-white mb-1">{job.title}</h2>
                    <p className="text-gray-400">{job.company?.name}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span><FaMapMarkerAlt className="inline mr-1 text-blue-400" />{job.location}</span>
                        <span><FaCalendarAlt className="inline mr-1 text-purple-400" />{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-white font-semibold mb-1">Salary Range</h3>
                        <p className="text-gray-400">{job.salaryRange || "Not specified"}</p>
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-white font-semibold mb-1">Job Description</h3>
                        <p className="text-gray-400 whitespace-pre-line">{job.description}</p>
                    </div>

                    <div className="border-t border-gray-700 pt-4 mt-4">
                        <h3 className="text-white font-semibold mb-1">Requirements</h3>
                        {job.requirements?.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No requirements listed.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
