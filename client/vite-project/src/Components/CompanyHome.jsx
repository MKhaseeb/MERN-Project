import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export const CompanyHome = () => {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salaryRange: '',
    requirements: ''
  });

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

    // Load company info
    axios.get(`http://localhost:8000/api/company/${companyId}`, { withCredentials: true })
      .then(res => setCompany(res.data))
      .catch(err => {
        console.error("Error fetching company:", err);
        setError("❌ Failed to load company data.");
      });

    fetchCompanyJobs();
  }, [companyId]);

  const fetchCompanyJobs = () => {
    axios.get(`http://localhost:8000/api/jobs/company/${companyId}`, { withCredentials: true })
      .then(res => {
        console.log('Jobs response:', res);
        setJobs(res.data);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setError("❌ Failed to load job listings.");
      });
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/jobs', {
      ...newJob,
      requirements: newJob.requirements.split(',').map(req => req.trim()),
      company: companyId
    }, { withCredentials: true })
      .then(() => {
        setShowModal(false);
        setNewJob({ title: '', description: '', location: '', salaryRange: '', requirements: '' });
        fetchCompanyJobs();
      })
      .catch(err => {
        console.error("Error creating job:", err);
        alert("❌ Failed to create job");
      });
  };

  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!company) return <div className="text-center mt-10">🔄 Loading company info...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-700">Welcome, {company.companyName}</h2>

      <div className="text-right mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ➕ Create Job
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">📋 Job Listings</h3>
      {jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map(job => (
            <li key={job._id} className="p-4 border rounded shadow-sm">
              <h4 className="text-lg font-bold">{job.title}</h4>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salaryRange}</p>
              <p><strong>Requirements:</strong> {job.requirements?.join(', ')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No job listings yet.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">Create New Job</h3>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <input
                type="text"
                placeholder="Job Title"
                className="w-full p-2 border rounded"
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={newJob.description}
                onChange={e => setNewJob({ ...newJob, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Job Location"
                className="w-full p-2 border rounded"
                value={newJob.location}
                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
              />
              <input
                type="text"
                placeholder="Salary Range"
                className="w-full p-2 border rounded"
                value={newJob.salaryRange}
                onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })}
              />
              <input
                type="text"
                placeholder="Requirements (comma-separated)"
                className="w-full p-2 border rounded"
                value={newJob.requirements}
                onChange={e => setNewJob({ ...newJob, requirements: e.target.value })}
              />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                ✅ Post Job
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
