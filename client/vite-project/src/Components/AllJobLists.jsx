import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Hero from "../assets/Hero2.png";
import { useNavigate } from "react-router-dom";
import ApplyModal from "./ApplyModal";
import NavBar from "./NavBar";

const FILTER_OPTIONS = {
    Pay: ["100000", "115000", "130000", "150000", "170000"],
    Remote: ["Yes", "No"],
    Company: ["Google", "Amazon", "StartupX", "Freelance"],
    "Job Type": ["Full-time", "Part-time", "Contract", "Internship"],
    "Employer/Recruiter": ["Employer", "Recruiter"],
    Location: ["Ramallah", "Gaza", "Jerusalem", "Remote"],
    "Experience level": ["Entry", "Mid", "Senior"],
    "Residency Requirement": ["Required", "Not Required"],
    Education: ["Bachelor's", "Master's", "PhD", "No degree"],
};

export default function AllJobLists() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [showApplyModal, setShowApplyModal] = useState(false);
    const navigate = useNavigate();
    const [dropdownStates, setDropdownStates] = useState({});
    const [filters, setFilters] = useState(Object.fromEntries(Object.keys(FILTER_OPTIONS).map(key => [key, ""])));
    const detailRef = useRef(null);

    const handleApplyClick = () => {
        navigate(`/apply/${selectedJob._id}`, {
            state: { job: selectedJob },
        });
    };

    const toggleDropdown = (key) => {
        setDropdownStates((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const selectFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setDropdownStates((prev) => ({ ...prev, [key]: false }));
    };

    useEffect(() => {
        axios.get("http://localhost:8000/api/jobs", { withCredentials: true })
            .then((res) => setJobs(res.data))
            .catch((err) => {
                console.error(err);
                setError("Failed to load job listings");
            });
    }, []);

    useEffect(() => {
        if (selectedJob) {
            detailRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedJob]);

    const filteredJobs = jobs.filter((job) => {
        const titleMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase());
        const locationMatch = job.location.toLowerCase().includes(locationQuery.toLowerCase());
        const salaryNum = parseInt(job.salaryRange?.replace(/[^0-9]/g, "") || "0", 10);
        const salaryFilterNum = parseInt(filters.Pay || "0", 10);
        const salaryMatch = !filters.Pay || salaryNum >= salaryFilterNum;
        const remoteMatch = !filters.Remote || (filters.Remote === "Yes" ? job.location.toLowerCase().includes("remote") : !job.location.toLowerCase().includes("remote"));
        const companyMatch = !filters.Company || job.company?.name?.toLowerCase().includes(filters.Company.toLowerCase());
        const typeMatch = !filters["Job Type"] || job.type === filters["Job Type"];
        const levelMatch = !filters["Experience level"] || job.experience === filters["Experience level"];
        const educationMatch = !filters.Education || job.education === filters.Education;

        return (
            titleMatch && locationMatch && salaryMatch && remoteMatch && companyMatch && typeMatch && levelMatch && educationMatch
        );
    });

    return (
        <div className="min-h-screen bg-[#0f1214] text-white">
            <NavBar />

            <section className="relative bg-[#0f1214] py-20 px-6 border-b border-gray-800 overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
                    <div className="md:w-1/2 text-center md:text-left">
                        <h2 className="text-4xl font-bold mb-4 text-white leading-tight">
                            Find your <span className="text-blue-400">next opportunity</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-6">
                            Explore jobs tailored to your passion across Palestine and beyond.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <input
                                type="text"
                                placeholder="Job title"
                                className="w-64 px-4 py-2 rounded border border-gray-700 bg-[#161a1d] text-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-64 px-4 py-2 rounded border border-gray-700 bg-[#161a1d] text-white placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-500"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow flex items-center gap-2">
                                <FaSearch /> Search
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <img
                            src={Hero}
                            alt="Job search illustration"
                            className="w-full max-w-[830px] mx-auto md:mx-10 mt-8 drop-shadow-xl z-10 relative"
                        />
                    </div>
                </div>
            </section>

            <div className="bg-[#0f1214] sticky top-0 z-30 border-b border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto overflow-x-auto">
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(FILTER_OPTIONS).map(([label, options]) => (
                            <div key={label} className="relative inline-block text-left">
                                <button
                                    onClick={() => toggleDropdown(label)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1e2328] hover:bg-[#2c343c] text-white border border-gray-700 rounded-full text-sm shadow"
                                >
                                    <span>
                                        {label}: {filters[label] ? (label === "Pay" ? `$${filters[label]}+` : filters[label]) : "All"}
                                    </span>
                                    {filters[label] && (
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                selectFilter(label, "");
                                            }}
                                            className="ml-1 text-gray-400 hover:text-red-400 text-lg cursor-pointer"
                                        >×</span>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex px-6 py-8 gap-6 max-w-7xl mx-auto">
                <div className="w-2/5 pr-2 space-y-4">
                    {filteredJobs.map((job) => (
                        <div
                            key={job._id}
                            onClick={() => setSelectedJob(job)}
                            className={`cursor-pointer bg-[#161a1d] p-5 rounded-lg border ${selectedJob?._id === job._id ? "border-blue-500" : "border-gray-800"} shadow hover:shadow-blue-500/30 transition-all`}
                        >
                            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                            <p className="text-gray-500 truncate">{job.description}</p>
                            <div className="text-sm text-gray-500 mt-1">
                                <FaMapMarkerAlt className="inline mr-1 text-blue-400" />
                                {job.location}
                            </div>
                        </div>
                    ))}
                </div>

                <div ref={detailRef} className="w-3/5 bg-[#161a1d] p-8 rounded-lg border border-gray-800 shadow-xl sticky top-8">
                    {selectedJob ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1">{selectedJob.title}</h2>
                                <p className="text-gray-400">{selectedJob.company?.name || "Company Name"}</p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                    <span><FaMapMarkerAlt className="inline mr-1 text-blue-400" />{selectedJob.location}</span>
                                    <span><FaCalendarAlt className="inline mr-1 text-purple-400" />{new Date(selectedJob.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-white font-semibold mb-1">Salary & Job Type</h3>
                                <p className="text-gray-400"><span className="font-medium">Salary Range:</span> {selectedJob.salaryRange || "Not specified"}</p>
                                <p className="text-gray-400"><span className="font-medium">Type:</span> Full-time</p>
                            </div>
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-white font-semibold mb-1">Job Description</h3>
                                <p className="text-gray-400 whitespace-pre-line">{selectedJob.description}</p>
                            </div>
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="text-white font-semibold mb-1">Requirements</h3>
                                {selectedJob.requirements?.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                                        {selectedJob.requirements.map((req, i) => <li key={i}>{req}</li>)}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No requirements listed.</p>
                                )}
                                {showApplyModal && selectedJob && (
                                    <ApplyModal
                                        jobTitle={selectedJob.title}
                                        onClose={() => setShowApplyModal(false)}
                                        onSubmit={(formData) => {
                                            const userId = localStorage.getItem("userId");
                                            if (!userId) {
                                                alert("Please login first.");
                                                return;
                                            }
                                            const token = localStorage.getItem("token");
                                            axios.post(`http://localhost:8000/api/jobs/${selectedJob._id}/apply`, formData, {
                                                headers: {
                                                    "Content-Type": "multipart/form-data",
                                                    Authorization: `Bearer ${token}`
                                                },
                                                withCredentials: true,
                                            })
                                                .then(() => alert("Application submitted successfully!"))
                                                .catch(() => alert("Failed to submit application."));
                                        }}
                                    />
                                )}
                            </div>
                            <div className="pt-4 border-t border-gray-700">
                                <button
                                    onClick={handleApplyClick}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold w-full"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-lg">Select a job to see details.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
