import React, { useState } from 'react';
import axios from 'axios';
import { Menu } from '@headlessui/react';
import { FaEllipsisV } from 'react-icons/fa';
import JobApplicants from './JobApplicant'; // Import your JobApplicants component

const JobTable = ({ jobs, setJobs, selectedJobId, setSelectedJobId }) => {
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  // New state to track which job's applicants modal is open
  const [modalJobId, setModalJobId] = useState(null);
  const companyId = localStorage.getItem("companyId");
  const companyJobs = (jobs || []).filter(job => job.company === companyId);


const filteredJobs = companyJobs.filter(job => {
    if (filterStatus === 'all') return true;
    return job.status?.toLowerCase() === filterStatus;
  });

  const handleCheckboxChange = (jobId) => {
    setSelectedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    );
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      await Promise.all(
        selectedJobs.map(id =>
          axios.patch(`http://localhost:8000/api/jobs/${id}`, { status: newStatus })
        )
      );
      const updatedList = jobs.map(job =>
        selectedJobs.includes(job._id) ? { ...job, status: newStatus } : job
      );
      setJobs(updatedList);
      setSelectedJobs([]);
    } catch (err) {
      console.error('Failed to update job statuses:', err);
    }
  };
  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:8000/api/jobs/${jobId}`);
      const updatedJobs = jobs.filter(job => job._id !== jobId);
      setJobs(updatedJobs);
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };
  return (
    <div className="bg-[#161a1d] p-6 rounded-xl border border-gray-700 shadow text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">

        </div>

        {selectedJobs.length > 0 && (
          <Menu as="div" className="relative">
            <Menu.Button className="bg-gray-800 px-4 py-2 rounded text-white border border-gray-600">Status ▾</Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-[#1c1f23] rounded border border-gray-700 shadow-lg z-10">
              {['active', 'paused', 'closed'].map(status => (
                <Menu.Item key={status}>
                  {({ active }) => (
                    <button
                      onClick={() => handleBulkStatusChange(status)}
                      className={`block px-4 py-2 text-sm w-full text-left capitalize ${active ? 'bg-gray-700' : ''
                        }`}
                    >
                      {status === 'active' ? 'Reopen jobs' : `${status.charAt(0).toUpperCase() + status.slice(1)} jobs`}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Menu>
        )}
      </div>

      <table className="w-full text-left">
        <thead className="bg-[#1c1f23] text-gray-300">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Location</th>
            <th className="p-2">Salary</th>
            <th className="p-2">Applicants</th> {/* New column */}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobs.map(job => (
            <React.Fragment key={job._id}>
              <tr
                className="border-t border-gray-700 text-gray-300 cursor-pointer hover:bg-[#1c1f23] transition"
                onClick={() => setSelectedJobId(selectedJobId === job._id ? null : job._id)}
              >

                <td className="p-2 font-semibold text-white">{job.title}</td>
                <td className="p-2">{job.location}</td>
                <td className="p-2">{job.salaryRange}</td>
                <td className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalJobId(job._id);
                    }}
                    className="px-3 py-1 text-sm bg-[#128a64] hover:bg-[#0E5640] rounded"
                  >
                    Show Applicants
                  </button>
                </td>
                <td className="p-2">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="text-white hover:text-gray-300" onClick={(e) => e.stopPropagation()}>
                      <FaEllipsisV />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 mt-1 w-40 bg-[#1c1f23] border border-gray-700 rounded shadow-md z-20">

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteJob(job._id);
                            }} className={`block w-full px-4 py-2 text-sm text-left ${active ? 'bg-gray-700' : ''}`}>
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>

              {selectedJobId === job._id && (
                <tr className="bg-[#1c1f23] border-t border-gray-700 text-gray-300">
                  <td colSpan="6" className="p-4">
                    <p className="text-white font-bold mb-2">Description</p>
                    <p className="text-gray-400 mb-4 whitespace-pre-line">{job.description}</p>

                    <div>
                      <p className="text-white font-bold mb-2">Requirements</p>
                      {job.requirements?.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No requirements listed.</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Modal for JobApplicants */}
      {modalJobId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setModalJobId(null)}
        >
          <div
            className="bg-[#1c1f23] rounded-lg max-w-lg w-full p-6 text-white"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalJobId(null)}
              className="mb-4 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
            >
              ← Close
            </button>
            <JobApplicants jobId={modalJobId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTable;
