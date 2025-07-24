const Job = require('../models/JobListing.model');

// Get all jobs
module.exports.getAllJobs = (req, res) => {
    Job.find()
        .populate('company') // Optional: populate company info
        .populate('applicants') // Optional: populate applicants info
        .then(jobs => res.json(jobs))
        .catch(err => res.status(500).json({ message: 'Failed to fetch jobs', error: err }));
};

// Get job by ID
module.exports.getJobById = (req, res) => {
    Job.findById(req.params.id)
        .populate('company')
        .populate('applicants')
        .then(job => {
            if (!job) return res.status(404).json({ message: 'Job not found' });
            res.json(job);
        })
        .catch(err => res.status(500).json({ message: 'Failed to fetch job', error: err }));
};

// Create a new job
module.exports.createJob = (req, res) => {
    Job.create(req.body)
        .then(newJob => res.status(201).json(newJob))
        .catch(err => res.status(400).json({ message: 'Failed to create job', error: err }));
};

// Update a job
module.exports.updateJob = (req, res) => {
    Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then(updatedJob => {
            if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
            res.json(updatedJob);
        })
        .catch(err => res.status(400).json({ message: 'Failed to update job', error: err }));
};

// Delete a job
module.exports.deleteJob = (req, res) => {
    Job.findByIdAndDelete(req.params.id)
        .then(deletedJob => {
            if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
            res.json({ message: 'Job deleted successfully' });
        })
        .catch(err => res.status(500).json({ message: 'Failed to delete job', error: err }));
};

// In controllers/job.controller.js
exports.getJobsByCompany = (req, res) => {
    Job.find({ company: req.params.companyId })
        .then(jobs => res.json(jobs))
        .catch(err => res.status(500).json({ message: 'Failed to fetch jobs', error: err }));
};

// controllers/job.controller.js
module.exports.getUserApplications = async (req, res) => {
    try {
        const userId = req.params.userId;

        const jobs = await Job.find({ "applications.user": userId })
            .populate("company", "companyName") // Optional: to show company info
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
};

