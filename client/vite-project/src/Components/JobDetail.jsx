import React from "react";
import { X } from "lucide-react";

export const JobDetail = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#1b1f24] text-white rounded-xl shadow-xl w-full max-w-2xl relative p-6 border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
        <p className="text-sm text-gray-400 mb-4">{job.company}</p>

        <div className="space-y-2 text-sm">
          <p>
            <span className="text-gray-400">Status:</span>{" "}
            <span className="capitalize">{job.status}</span>
          </p>
          <p>
            <span className="text-gray-400">Applied At:</span>{" "}
            {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <span className="text-gray-400">Cover Letter:</span>{" "}
            {job.coverLetter || "None"}
          </p>
        </div>

        <div className="mt-4">
          <a
            href={`http://localhost:8000/${job.cvPath}`}
            download={job.cvOriginalName}
            className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium"
          >
            Download CV
          </a>
        </div>
      </div>
    </div>
  );
};
