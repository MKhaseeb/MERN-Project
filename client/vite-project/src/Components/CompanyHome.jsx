import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaBriefcase,
  FaUsers,
  FaClock,
  FaCheck,
  FaHome,
  FaClipboardList,
  FaUserFriends,
  FaBuilding,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import JobTable from './JobTable'; // ✅ Import redesigned JobTable
import CreateJobPage from './CreateJobPage'; // ✅ Add CreateJobPage for integrated access
import LogoutButton from './LogoutButton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const CompanyHome = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState("");
  const [showCreateJob, setShowCreateJob] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const companyId = location.state?.companyId || localStorage.getItem("companyId");

  useEffect(() => {
    if (!companyId) {
      setError("❌ Company ID not found. Please login again.");
      setTimeout(() => navigate("/login_company"), 2000);
      return;
    }
    if (location.state?.companyId) {
      localStorage.setItem("companyId", location.state.companyId);
    }

    axios.get(`http://localhost:8000/api/company/${companyId}`)
      .then(res => setCompany(res.data))
      .catch(() => setError("❌ Failed to load company data."));

    axios.get(`http://localhost:8000/api/jobs/company/${companyId}`)
      .then(res => setJobs(res.data))
      .catch(() => setError("❌ Failed to load job listings."));

    axios.get(`http://localhost:8000/api/applications/company/${companyId}`)
      .then(res => setApplications(res.data))
      .catch(() => setError("❌ Failed to load applications."));
  }, [companyId]);

  const totalApplications = applications.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalHired = applications.filter(app => app.status === 'Hired').length;

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Applications',
        data: [12, 19, 3, 5, 2, 10],
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f655',
        fill: true,
        tension: 0.3,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: 'white' }
      },
      title: {
        display: true,
        text: 'Monthly Applications',
        color: 'white'
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: '#2c343c' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: '#2c343c' }
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f1214] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1214] p-6 space-y-4 shadow-xl sticky top-0 h-screen border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6">🏢 {company?.companyName}</h2>
        <SidebarButton icon={<FaHome />} label="Overview" setActiveTab={setActiveTab} activeTab={activeTab} tabName="overview" />
        <SidebarButton icon={<FaClipboardList />} label="Jobs" setActiveTab={setActiveTab} activeTab={activeTab} tabName="jobs" />
        <SidebarButton icon={<FaUserFriends />} label="Applications" setActiveTab={setActiveTab} activeTab={activeTab} tabName="applications" />
        <SidebarButton icon={<FaBuilding />} label="Company Profile" setActiveTab={setActiveTab} activeTab={activeTab} tabName="profile" />
        <LogoutButton />

      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0f1214] p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-white">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <Card icon={<FaBriefcase />} title="Total Jobs" value={totalJobs} color="blue-400" />
              <Card icon={<FaUsers />} title="Applications" value={totalApplications} color="green-400" />
              <Card icon={<FaClock />} title="Active Jobs" value={activeJobs} color="yellow-400" />
              <Card icon={<FaCheck />} title="Hires" value={totalHired} color="purple-400" />
            </div>
            <div className="bg-[#161a1d] p-6 rounded-xl border border-gray-700 shadow">
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        )}

        {activeTab === 'jobs' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Job Listings</h3>
              <button
                onClick={() => setShowCreateJob(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow"
              >
                + Create Listing
              </button>
            </div>
            {showCreateJob ? (
              <CreateJobPage />
            ) : (
              <JobTable jobs={jobs} setJobs={setJobs} selectedJobId={selectedJobId} setSelectedJobId={setSelectedJobId} />
            )}
          </section>
        )}

        {activeTab === 'applications' && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-white">Recent Applications</h3>
            <table className="min-w-full bg-[#161a1d] rounded shadow overflow-hidden border border-gray-700">
              <thead className="bg-[#1c1f23] text-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left text-sm">Applicant</th>
                  <th className="px-4 py-2 text-left text-sm">Job Title</th>
                  <th className="px-4 py-2 text-left text-sm">Status</th>
                  <th className="px-4 py-2 text-left text-sm">Applied At</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map(app => (
                  <tr key={app._id} className="border-t border-gray-700 text-gray-400">
                    <td className="px-4 py-2 text-sm">{app.user?.name || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm">{app.job?.title || 'N/A'}</td>
                    <td className="px-4 py-2 text-sm">{app.status}</td>
                    <td className="px-4 py-2 text-sm">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'profile' && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-white">Company Profile</h3>
            <div className="bg-[#161a1d] p-6 rounded border border-gray-700 shadow space-y-3 text-gray-300">
              <p><strong className="text-white">Company Name:</strong> {company.companyName}</p>
              <p><strong className="text-white">Email:</strong> {company.email}</p>
              <p><strong className="text-white">Location:</strong> {company.location || 'N/A'}</p>
              <p><strong className="text-white">Website:</strong> <a href={company.website} className="text-blue-400 underline">{company.website}</a></p>
              <p><strong className="text-white">Description:</strong> {company.description || 'No description yet.'}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const SidebarButton = ({ icon, label, setActiveTab, activeTab, tabName }) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center gap-2 w-full px-4 py-2 rounded transition-all text-left ${activeTab === tabName ? 'bg-[#1c1f23] font-semibold' : 'hover:bg-[#1c1f23]'
      }`}
  >
    {icon} {label}
  </button>
);

const Card = ({ icon, title, value, color }) => (
  <div className="bg-[#161a1d] border border-gray-700 p-4 rounded-xl text-center shadow hover:shadow-blue-500/20 transition-all">
    <div className={`mx-auto text-${color} text-2xl`}>{icon}</div>
    <p className="mt-2 text-xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{title}</p>
  </div>
);
