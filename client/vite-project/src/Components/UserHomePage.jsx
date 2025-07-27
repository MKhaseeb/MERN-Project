import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaSignOutAlt, FaBookmark, FaBriefcase, FaBell } from "react-icons/fa";
import ChartsComp from "./ChartsComp";

const colors = {
    bg: "#0f1214",
    card: "#161a1d",
    grid: "#2c343c",
    sidebar: "#1c1f23",
    primary: "#3b82f6",
    chartFill: "#3b82f655",
};

const Sidebar = ({ active, onChange, onLogout }) => (
    <div className="h-screen w-64 bg-[#1c1f23] text-white p-6 flex flex-col justify-between fixed left-0 top-0">
        <div className="space-y-4">
            <h1 className="text-xl font-bold mb-6">Job Plus</h1>
            {[
                { icon: <FaUser />, label: "Profile", key: "profile" },
                { icon: <FaBriefcase />, label: "Applications", key: "applications" },
                { icon: <FaBookmark />, label: "Saved Jobs", key: "saved" },
                { icon: <FaBell />, label: "Notifications", key: "notifications" },
                { icon: <FaBriefcase />, label: "Insights", key: "charts" },
            ].map(({ icon, label, key }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`flex items-center gap-2 p-3 w-full rounded-xl transition duration-200 ${active === key ? "bg-[#161a1d]" : "hover:bg-[#2c343c]"
                        }`}
                >
                    {icon} {label}
                </button>
            ))}
        </div>
        <button
            onClick={onLogout}
            className="flex items-center gap-2 p-3 w-full rounded-xl hover:bg-red-600 transition duration-200"
        >
            <FaSignOutAlt /> Logout
        </button>
    </div>
);

const API_KEY = "b4232c55e1msh2fa179ace936293p15516djsn3b98c2ac71c2";
const API_HOST = "jsearch.p.rapidapi.com";

const processJobData = (jobs) => {
    const data = {
        accumulatedCounts: {},
        salaryByTitle: {},
        locationCounts: {},
        skillDemand: {},
        contractTypes: {},
        experienceLevels: {},
        remoteJobs: { remote: 0, onsite: 0, hybrid: 0 },
        topEmployers: {},
        jobPostingTrends: {},
        allTitles: [],
    };

    const skillKeywords = [
        "JavaScript",
        "Python",
        "PHP",
        "SQL",
        "AWS",
        "Docker",
        "Java",
        "HTML",
        "CSS",
        "DevOps",
        "C#",
        "Cloud",
        "MX Records",
        "DNS",
    ];

    jobs.forEach((job) => {
        const title = job.job_title?.split(" at ")[0]?.trim();
        if (!title) return;
        data.accumulatedCounts[title] = (data.accumulatedCounts[title] || 0) + 1;
        data.allTitles.push(title);

        const salaryMatch = job.job_description?.match(/(\d{2,3})K\+?/i);
        if (salaryMatch) {
            const salary = parseInt(salaryMatch[1]) * 1000;
            data.salaryByTitle[title] = data.salaryByTitle[title] || [];
            data.salaryByTitle[title].push(salary);
        }

        const country = job.job_country || "Unknown";
        const city = job.job_city || "Unknown";
        data.locationCounts[country] = (data.locationCounts[country] || 0) + 1;
        data.locationCounts[city] = (data.locationCounts[city] || 0) + 1;

        skillKeywords.forEach((skill) => {
            if (job.job_description?.toLowerCase().includes(skill.toLowerCase())) {
                data.skillDemand[skill] = (data.skillDemand[skill] || 0) + 1;
            }
        });

        const type = job.job_employment_type || "Unknown";
        data.contractTypes[type] = (data.contractTypes[type] || 0) + 1;

        if (/3[-–]?5\+? years/i.test(job.job_description)) {
            data.experienceLevels["Mid-Level"] = (data.experienceLevels["Mid-Level"] || 0) + 1;
        } else if (/senior/i.test(job.job_description)) {
            data.experienceLevels["Senior"] = (data.experienceLevels["Senior"] || 0) + 1;
        } else if (/entry[- ]?level/i.test(job.job_description)) {
            data.experienceLevels["Entry"] = (data.experienceLevels["Entry"] || 0) + 1;
        }

        if (job.job_is_remote) {
            data.remoteJobs.remote++;
        } else if (/hybrid/i.test(job.job_description)) {
            data.remoteJobs.hybrid++;
        } else {
            data.remoteJobs.onsite++;
        }

        const employer = job.employer_name || "Unknown";
        data.topEmployers[employer] = (data.topEmployers[employer] || 0) + 1;

        const date = new Date(job.job_posted_at_datetime_utc);
        const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
        data.jobPostingTrends[key] = (data.jobPostingTrends[key] || 0) + 1;
    });

    data.topEmployers = Object.entries(data.topEmployers)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    data.jobPostingTrends = Object.entries(data.jobPostingTrends)
        .map(([period, count]) => ({
            period,
            count,
            date: new Date(`${period.split("/")[1]}-${period.split("/")[0]}-15`),
        }))
        .sort((a, b) => a.date - b.date);

    return data;
};

const UserHomePage = () => {
    const [page, setPage] = useState("applications");
    const [applications, setApplications] = useState([]);
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });

    const [processedData, setProcessedData] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("https://jsearch.p.rapidapi.com/search", {
                params: {
                    query: "developer",
                    page: "1",
                    num_pages: "10",
                    allTitles: [
                        'Senior JavaScript Developer',
                        'Python Engineer',
                        'Full Stack Developer',
                        'Data Analyst',
                        'Cloud Solutions Architect',
                        'DevOps Engineer',
                        'Machine Learning Specialist',
                        'Frontend Developer',
                        'Backend Engineer',
                        'UX/UI Designer',
                        'doctor',
                        'nurse',
                        'teacher',
                        'driver'
                    ]
                },
                headers: {
                    "X-RapidAPI-Key": API_KEY,
                    "X-RapidAPI-Host": API_HOST
                },
            });
            const jobs = response.data.data;
            const structured = processJobData(jobs);
            setProcessedData(structured);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        if (!userId) return;
        // Fetch applications
        axios
            .get(`http://localhost:8000/api/jobs/user/${userId}/applications`, { withCredentials: true })
            .then((res) => setApplications(Array.isArray(res.data) ? res.data : []))
            .catch((err) => console.error("Failed to load applications", err));

        // Fetch user info
        axios
            .get(`http://localhost:8000/api/users/${userId}`, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
                setFormData({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                });
            })
            .catch((err) => console.error("Failed to load user info", err));
    }, [userId]);

    const handleProfileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProfileSave = () => {
        axios
            .put(`http://localhost:8000/api/users/${userId}`, formData, { withCredentials: true })
            .then((res) => {
                setUser(res.data);
                setEditing(false);
            })
            .catch((err) => console.error("Failed to update profile", err));
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        // Optionally clear tokens or cookies here
        window.location.href = "/login"; // Redirect to login or home
    };

    const statCounts = {
        totalApplications: applications.length || 0,
        interviews: 0,
        saved: 0,
        profileProgress: user ? "80%" : "--",
    };

    return (
        <div className="bg-[#0f1214] min-h-screen pl-64">
            <Sidebar active={page} onChange={setPage} onLogout={handleLogout} />
            <main className="p-8 text-white min-h-screen">
                <h1 className="text-3xl font-bold mb-6">Welcome back {user?.firstName || "👋"}</h1>

                {page === "applications" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <StatCard title="Applications" value={statCounts.totalApplications} />
                            <StatCard title="Interviews" value={statCounts.interviews} />
                            <StatCard title="Saved Jobs" value={statCounts.saved} />
                            <StatCard title="Profile Completeness" value={statCounts.profileProgress} />
                        </div>

                        <div className="bg-[#161a1d] p-6 rounded-2xl shadow border border-[#2c343c] mb-6 overflow-auto max-h-[400px]">
                            <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-[#1c1f23] text-gray-300 sticky top-0">
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
                                                className="border-b border-[#2c343c] hover:bg-[#2c343c] transition-colors duration-200"
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
                    <div className="bg-[#161a1d] p-6 rounded-2xl shadow border border-[#2c343c] max-w-xl">
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
                                            autoComplete="given-name"
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
                                            autoComplete="family-name"
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
                                            type="email"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4">
                                    {!editing ? (
                                        <button
                                            onClick={() => setEditing(true)}
                                            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleProfileSave}
                                                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditing(false);
                                                    setFormData({
                                                        firstName: user.firstName || "",
                                                        lastName: user.lastName || "",
                                                        email: user.email || "",
                                                    });
                                                }}
                                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition"
                                            >
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

                {page === "charts" && (
                    <>
                        {loading ? (
                            <p className="text-gray-400">Loading job market insights...</p>
                        ) : processedData ? (
                            <ChartsComp data={processedData} />
                        ) : (
                            <p className="text-red-500">Failed to load data.</p>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-[#161a1d] text-white p-5 rounded-2xl shadow-md border border-[#2c343c]">
        <h2 className="text-lg font-semibold mb-1 text-gray-300">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default UserHomePage;
