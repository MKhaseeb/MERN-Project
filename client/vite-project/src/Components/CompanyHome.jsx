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
  FaBell,
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import JobTable from './JobTable';
import CreateJobPage from './CreateJobPage';
import LogoutButton from './LogoutButton';
import Notifications from './Notafications';
import { io } from 'socket.io-client';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const socket = io("http://localhost:8000", { withCredentials: true });

export const CompanyHome = () => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("companyNotifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [hasUnread, setHasUnread] = useState(notifications.length > 0);

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
  }, [companyId, location.state, navigate]);

  // Socket - تسجيل الشركة للوصل للإشعارات
  useEffect(() => {
    if (companyId) {
      socket.emit("registerCompany", companyId);
    }

    socket.on("newApplication", (data) => {
      setNotifications(prev => {
        const updated = [data, ...prev];
        localStorage.setItem("companyNotifications", JSON.stringify(updated));
        setHasUnread(true);
        return updated;
      });
    });

    return () => {
      socket.off("newApplication");
    };
  }, [companyId]);

  const handleNotificationTabClick = () => {
    setActiveTab("notification");
    setHasUnread(false);
  };

  // بيانات لمثال الرسم البياني
  const totalApplications = applications.length;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.status === 'active').length;
  const totalHired = applications.filter(app => app.status === 'Hired').length;

  // Professional chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        type: 'bar',
        label: 'Applications',
        data: [2, 5, 3, 6, 4, 8, 5],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 0,
        borderRadius: 4,
        yAxisID: 'y1',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            size: 12,
            weight: '500'
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11
          }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Applications',
          color: '#94a3b8',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          padding: 8,
          font: {
            size: 11
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Hires',
          color: '#94a3b8',
          font: {
            size: 12
          }
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#94a3b8',
          padding: 8,
          font: {
            size: 11
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };


  return (
    <div className="min-h-screen flex bg-[#0f1214] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1214] p-6 space-y-4 shadow-xl sticky top-0 h-screen border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6">🏢 {company?.companyName}</h2>
        <SidebarButton icon={<FaHome />} label="Overview" setActiveTab={setActiveTab} activeTab={activeTab} tabName="overview" />
        <SidebarButton icon={<FaClipboardList />} label="Jobs" setActiveTab={setActiveTab} activeTab={activeTab} tabName="jobs" />
        <SidebarButton icon={<FaBuilding />} label="Company Profile" setActiveTab={setActiveTab} activeTab={activeTab} tabName="profile" />

        <button
          onClick={handleNotificationTabClick}
          className={`flex items-center gap-2 w-full px-4 py-2 rounded transition-all text-left ${activeTab === "notification" ? 'bg-[#1c1f23] font-semibold' : 'hover:bg-[#1c1f23]'}`}
        >
          <FaBell />
          notification
          {hasUnread && (
            <span className="ml-auto w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
          )}
        </button>
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#0f1214] p-8 overflow-y-auto">
        {activeTab === 'overview' && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-white">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-10">
              <Card icon={<FaBriefcase />} title="Total Jobs" value={totalJobs} color="blue-400" />
              <Card icon={<FaUsers />} title="Applications" value={totalApplications} color="green-400" />
            </div>
            <div className="bg-[#161a1d] p-6 rounded-xl border border-gray-700 shadow-lg mb-10">
              <div className="h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </>
        )}

        {activeTab === 'jobs' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Job Listings</h3>
              <button
                onClick={() => setShowCreateJob(true)}
                className="px-4 py-2  bg-[#128a64] hover:bg-[#0E5640] text-white rounded-lg shadow-md transition-all duration-300"
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


        {activeTab === 'profile' && (
          <section>
            <h3 className="text-xl font-semibold mb-4 text-white">Company Profile</h3>
            <div className="bg-[#161a1d] p-6 rounded-xl border border-gray-700 shadow space-y-4 text-gray-300">
              <div className="flex items-start">
                <div className="w-1/4 text-gray-400">Company Name:</div>
                <div className="w-3/4 text-white">{company?.companyName}</div>
              </div>
              <div className="flex items-start">
                <div className="w-1/4 text-gray-400">Email:</div>
                <div className="w-3/4 text-white">{company?.email}</div>
              </div>
              <div className="flex items-start">
                <div className="w-1/4 text-gray-400">Location:</div>
                <div className="w-3/4 text-white">{company?.location || 'N/A'}</div>
              </div>
              <div className="flex items-start">
                <div className="w-1/4 text-gray-400">Website:</div>
                <div className="w-3/4">
                  <a href={company?.website} className="text-blue-400 hover:text-blue-300 underline">
                    {company?.website}
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-1/4 text-gray-400">Description:</div>
                <div className="w-3/4 text-white">
                  {company?.description || 'No description yet.'}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'notification' && companyId && (
          <Notifications companyId={companyId} />
        )}
      </main>
    </div>
  );
};

const SidebarButton = ({ icon, label, setActiveTab, activeTab, tabName }) => (
  <button
    onClick={() => setActiveTab(tabName)}
    className={`flex items-center gap-2 w-full px-4 py-2 rounded transition-all text-left ${activeTab === tabName ? 'bg-[#1c1f23] font-semibold' : 'hover:bg-[#1c1f23]'}`}
  >
    {icon} {label}
  </button>
);

const Card = ({ icon, title, value, color }) => (
  <div className={`bg-gradient-to-br from-[#1c1f23] to-[#161a1d] border border-gray-800 p-5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300`}>
    <div className={`text-${color} text-3xl mb-3`}>{icon}</div>
    <p className="text-2xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-gray-400 font-medium">{title}</p>
  </div>
);