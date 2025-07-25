const Job = require('../models/JobListing.model');

module.exports = {
    // Get all jobs
    getAllJobs: (req, res) => {
        Job.find()
            .populate('company')
            .populate('applications.user')
            .then(jobs => res.json(jobs))
            .catch(err => res.status(500).json({ message: 'Failed to fetch jobs', error: err }));
    },

    // Get job by ID
    getJobById: (req, res) => {
        Job.findById(req.params.id)
            .populate('company')
            .populate('applications.user')
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

            const jobs = await Job.find({ "applications.user": userId })
                .populate("company", "companyName")
                .select("title company applications")
                .lean();

            const userJobs = jobs.map(job => {
                const userApplication = job.applications.find(app => app.user.toString() === userId);
                return {
                    jobId: job._id,
                    title: job.title,
                    company: job.company?.companyName || "Unknown",
                    appliedAt: userApplication?.appliedAt,
                };
            });

            res.json(userJobs);
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
            console.log("📌 req.user:", req.user);
            const userId = req.user.id; // From auth middleware
            // In JobController.applyToJob
            const coverLetter = req.body.coverLetter; // Now correctly populated            console.log('Uploaded file:', req.file);

            const cvFile = req.file; // Uploaded CV file

            if (!cvFile) {
                return res.status(400).json({ message: 'CV file is required' });
            }

            const job = await Job.findById(jobId);
            if (!job) return res.status(404).json({ message: 'Job not found' });

            // Check if already applied
            const alreadyApplied = job.applications.some(
                app => app.user.toString() === userId
            );
            if (alreadyApplied) {
                return res.status(400).json({ message: 'Already applied' });
            }

            // Add application with file metadata
            job.applications.push({
                user: userId,
                appliedAt: new Date(),
                coverLetter,
                cvPath: cvFile.path, // Store file path
                cvOriginalName: cvFile.originalname
            });

            await job.save();
            res.status(200).json({ message: 'Application submitted' });
        } catch (err) {
            console.error('Error applying to job:', err);
            res.status(500).json({ message: 'Server error', error: err });
        }
    }
};
