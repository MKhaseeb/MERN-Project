import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import Hero from '../assets/Hero2.png'

export default function JobListingPage() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/api/jobs", { withCredentials: true })
            .then(res => setJobs(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load job listings");
            });
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        job.location.toLowerCase().includes(locationQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f1214] text-white">
            {/* Navbar */}
            <nav className="bg-[#0f1214] border-b border-gray-800 px-6 py-4 shadow-sm">
                <h1 className="text-2xl font-bold tracking-wide text-white">Job Plus</h1>
            </nav>

<section className="relative bg-[#0f1214] py-20 px-6 border-b border-gray-800 overflow-hidden">
  <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
    {/* Left: Heading + Search */}
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

    {/* Right: Styled Illustration */}
    <div className="md:w-1/2 relative">
      <img
        src={Hero}
        alt="Job search illustration"
        className="w-full max-w-[830px] mx-auto md:mx-10 mt-8  drop-shadow-xl z-10 relative "
      />

      {/* Floating Icons - Simulated with absolute elements */}
      <div className="absolute top-8 left-4 w-6 h-6 bg-blue-600/30 rounded-full blur-sm animate-pulse" />
      <div className="absolute top-0 right-6 w-5 h-5 bg-blue-400/40 rounded-full blur-sm animate-ping" />
      <div className="absolute bottom-8 right-0 w-4 h-4 bg-blue-500/20 rounded-full blur-sm animate-pulse" />
    </div>
  </div>

  {/* Background glow circle */}
  <div className="absolute -top-20 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl opacity-30 pointer-events-none" />
</section>



            {/* Main Content */}
            <div className="flex px-6 py-8 gap-8 max-w-7xl mx-auto">
                {/* Job Listings */}
                <div className="w-2/3">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Available Jobs</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {filteredJobs.length === 0 ? (
                        <p className="text-gray-500">No job listings match your search.</p>
                    ) : (
                        <div className="space-y-6">
                            {filteredJobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="bg-[#161a1d] p-6 rounded-lg border border-gray-800 shadow hover:shadow-blue-500/30 transition-all"
                                >
                                    <h3 className="text-xl font-semibold mb-2 text-white">{job.title}</h3>
                                    <p className="text-gray-400 mb-4">{job.description}</p>
                                    <div className="flex flex-wrap items-center text-sm gap-4 text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-blue-400" /> {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaCalendarAlt className="text-purple-400" /> {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter Panel */}
                <aside className="w-1/3 bg-[#161a1d] p-6 rounded-lg border border-gray-800 shadow h-fit sticky top-8">
                    <h3 className="text-xl font-semibold mb-4 text-white">Filter Jobs</h3>
                    <form className="space-y-4">
                        <div>
                            <label className="block mb-1 text-gray-400">Location</label>
                            <input
                                type="text"
                                placeholder="e.g. Gaza"
                                className="w-full px-3 py-2 bg-black border border-gray-700 text-white placeholder-gray-500 rounded"
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-400">Job Type</label>
                            <select className="w-full px-3 py-2 bg-black border border-gray-700 text-white rounded">
                                <option>All</option>
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Remote</option>
                            </select>
                        </div>
                    </form>
                </aside>
            </div>
        </div>
    );
}
