const Job = require('../models/JobListing.model');
const Application = require('../models/Application'); // Add this import
const User = require('../models/user.model'); // Add this import

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

            // Find the job to get company reference
            const job = await Job.findById(jobId);
            if (!job) return res.status(404).json({ message: 'Job not found' });

            // Check if user already applied
            const existingApplication = await Application.findOne({
                job: jobId,
                user: userId
            });

            if (existingApplication) {
                return res.status(400).json({ message: 'Already applied to this job' });
            }

            // Create new application
            const newApplication = new Application({
                user: userId,
                company: job.company, // Use company from job
                job: jobId,
                coverLetter,
                cvPath: cvFile.path,
                cvOriginalName: cvFile.originalname
            });

            const savedApplication = await newApplication.save();

            // Add application to job's applications array
            await Job.findByIdAndUpdate(jobId, {
                $push: { applications: savedApplication._id }
            });

            // Add application to user's applications array
            await User.findByIdAndUpdate(userId, {
                $push: { applications: savedApplication._id }
            });

            res.status(201).json({
                message: 'Application submitted successfully',
                applicationId: savedApplication._id
            });
        } catch (err) {
            console.error('Error applying to job:', err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
};