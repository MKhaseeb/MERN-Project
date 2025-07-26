import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobApplicants = ({ jobId }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        const fetchApplicants = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await axios.get(`http://localhost:8000/api/jobs/${jobId}/applicants`);

                setApplicants(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load applicants.');
            } finally {
                setLoading(false);
                setSelectedApplicant(null); // reset on jobId change
            }
        };

        fetchApplicants();
    }, [jobId]);

    if (loading) return <p className="text-gray-400">Loading applicants...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="mt-4">
            <p className="text-white font-bold mb-2">Applicants</p>

            {selectedApplicant ? (
                <div className="bg-[#22272b] p-4 rounded-md">
                    <button
                        onClick={() => setSelectedApplicant(null)}
                        className="mb-4 px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        ← Back to applicants
                    </button>
                    <h3 className="text-white font-bold mb-2">{selectedApplicant.name}</h3>
                    <p className="text-gray-300 mb-2"><strong>Email:</strong> {selectedApplicant.email}</p>
                    {selectedApplicant.cvPath ? (
                        <p className="mb-3">
                            <strong>CV:</strong>{' '}
                            <a
                                href={`http://localhost:8000/${selectedApplicant.cvPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                            >
                                View / Download CV
                            </a>
                        </p>
                    ) : (
                        <p className="text-gray-500 mb-3">No CV uploaded.</p>
                    )}

                    <div>
                        <strong>Cover Letter:</strong>
                        <p className="whitespace-pre-wrap bg-gray-800 p-3 rounded max-h-60 overflow-y-auto mt-1 text-gray-300">
                            {selectedApplicant.coverLetter || 'No cover letter provided.'}
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {applicants.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-400 space-y-2 max-h-48 overflow-y-auto">
                            {applicants.map((applicant) => (
                                <li key={applicant.applicationId}>
                                    <button
                                        onClick={() => setSelectedApplicant(applicant)}
                                        className="font-semibold text-white hover:underline"
                                        type="button"
                                    >
                                        {applicant.name || 'Unnamed Applicant'}
                                    </button>{' '}
                                    — {applicant.email}
                                    —  {applicant.appliedAt}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No applicants yet.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default JobApplicants;
