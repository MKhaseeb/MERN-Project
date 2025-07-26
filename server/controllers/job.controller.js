const Job = require('../models/JobListing.model');
const Application = require('../models/Application'); // Add this import
const User = require('../models/user.model'); // Add this import
const { Server } = require("socket.io");


const getApplicantsForJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        // Find all applications for this job, and populate user info
        const applications = await Application.find({ job: jobId })
            .populate({
                path: 'user',
                select: 'name email firstName lastName'
            });

        // Map to desired output: include user info + CV + coverLetter
        const applicants = applications.map(app => ({
            applicationId: app._id,
            name: app.user?.name || `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim(),
            email: app.user?.email || 'No email',
            cvPath: app.cvPath,
            cvOriginalName: app.cvOriginalName,
            coverLetter: app.coverLetter || '',
            appliedAt: app.appliedAt || '',
        }));

        res.json(applicants);
    } catch (err) {
        console.error('Error fetching applicants:', err);
        res.status(500).json({ message: 'Failed to fetch applicants' });
    }
};


module.exports = {
    // Get all jobs
    getAllJobs: (req, res) => {
        Job.find()
            .populate('company')
            .populate({
                path: 'applications',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email'
                }
            })
            .then(jobs => res.json(jobs))
            .catch(err => res.status(500).json({ message: 'Failed to fetch jobs', error: err }));
    },

    // Get job by ID
    getJobById: (req, res) => {
        Job.findById(req.params.id)
            .populate('company')
            .populate({
                path: 'applications',
                populate: {
                    path: 'user',
                    select: 'firstName lastName email'
                }
            })
            .then(job => {
                if (!job) return res.status(404).json({ message: 'Job not found' });
                res.json(job);
            })
            .catch(err => res.status(500).json({ message: 'Failed to fetch job', error: err }));
    },

    // Create a new job
    createJob: (req, res) => {
        Job.create(req.body)
            .then(newJob => res.status(201).json(newJob))
            .catch(err => res.status(400).json({ message: 'Failed to create job', error: err }));
    },

    // Update a job
    updateJob: (req, res) => {
        Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .then(updatedJob => {
                if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
                res.json(updatedJob);
            })
            .catch(err => res.status(400).json({ message: 'Failed to update job', error: err }));
    },

    // Delete a job
    deleteJob: (req, res) => {
        Job.findByIdAndDelete(req.params.id)
            .then(deletedJob => {
                if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
                res.json({ message: 'Job deleted successfully' });
            })
            .catch(err => res.status(500).json({ message: 'Failed to delete job', error: err }));
    },

    // Get jobs by company
    getJobsByCompany: (req, res) => {
        Job.find({ company: req.params.companyId })
            .then(jobs => res.json(jobs))
            .catch(err => res.status(500).json({ message: 'Failed to fetch jobs', error: err }));
    },

    // Get applications submitted by a specific user
    getUserApplications: async (req, res) => {
        try {
            const userId = req.params.userId;

            // Query applications directly instead of through jobs
            const applications = await Application.find({ user: userId })
                .populate('job', 'title')
                .populate('company', 'companyName');

            const userApplications = applications.map(app => ({
                jobId: app.job?._id,
                title: app.job?.title,
                company: app.company?.companyName || "Unknown",
                appliedAt: app.appliedAt
            }));

            res.json(userApplications);
        } catch (err) {
            console.error("Error fetching user applications:", err);
            res.status(500).json({ message: "Failed to fetch applications." });
        }
    },

    // Apply to a job
    applyToJob: async (req, res) => {
        console.log("🔥 Apply route hit");

        try {
            const { jobId } = req.params;
            const userId = req.user.id;
            const { coverLetter } = req.body;
            const cvFile = req.file;

            if (!cvFile) {
                return res.status(400).json({ message: 'CV file is required' });
            }

            // Get job + company
            const job = await Job.findById(jobId).populate('company');
            if (!job) return res.status(404).json({ message: 'Job not found' });

            // Check if already applied
            const existingApplication = await Application.findOne({ job: jobId, user: userId });
            if (existingApplication) {
                return res.status(400).json({ message: 'Already applied to this job' });
            }

            // Save new application
            const newApplication = new Application({
                user: userId,
                company: job.company._id,
                job: jobId,
                coverLetter,
                cvPath: cvFile.path,
                cvOriginalName: cvFile.originalname
            });

            const savedApplication = await newApplication.save();

            // Update references
            await Job.findByIdAndUpdate(jobId, { $push: { applications: savedApplication._id } });
            await User.findByIdAndUpdate(userId, { $push: { applications: savedApplication._id } });

            // 🔔 Emit real-time notification via Socket.IO
            const user = await User.findById(userId);
            const message = `${user.fullName || user.name || 'A user'} applied to your job: ${job.title}`;

            // Make sure Socket.IO instance is attached to request
            if (req.io) {
                req.io.to(job.company._id.toString()).emit("newApplication", {
                    message,
                    jobId,
                    userName: user.firstName +" " + user.lastName || user.name,
                    jobTitle: job.title
                });

                console.log("📢 Notification emitted to company:", job.company._id.toString());
            } else {
                console.warn("⚠️ Socket.IO not available on req");
            }

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId: savedApplication._id
            });

        } catch (err) {
            console.error('Error applying to job:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    },

    // Updated function: getApplicantsForJob
    getApplicantsForJob
};
