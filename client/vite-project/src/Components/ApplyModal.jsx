import React, { useState, useRef } from "react";

const ApplyModal = ({ jobTitle, onClose, onSubmit }) => {
    const [cv, setCv] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setCv(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!cv || !coverLetter) {
            alert("Please upload your CV and write a cover letter.");
            return;
        }

        const formData = new FormData();
        formData.append("cv", cv);
        formData.append("coverLetter", coverLetter);

        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Apply for {jobTitle}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload your CV (PDF or DOC)
                        </label>
                        <div
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-sm text-gray-600">
                                    {cv ? (
                                        <span className="text-blue-600 font-medium">{cv.name}</span>
                                    ) : (
                                        <>
                                            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                                        </>
                                    )}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Letter
                        </label>
                        <textarea style={{color:"black"}}
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={5}
                            className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Explain why you're the perfect candidate for this position..."
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium shadow-sm hover:shadow-md transition-all"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyModal;