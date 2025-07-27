const Job = require('../models/JobListing.model');
const Application = require('../models/Application');
const User = require('../models/user.model');
const { Server } = require("socket.io");

// ✅ Update status of an application
const updateApplicationStatus = async (req, res) => {
  const { jobId, userId } = req.params;
  const { newStatus } = req.body;

  if (!newStatus) {
    return res.status(400).json({ message: "Missing newStatus" });
  }

  try {
    const application = await Application.findOne({ job: jobId, user: userId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = newStatus;
    await application.save();

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Failed to update application status:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get applicants for a job (unchanged)
const getApplicantsForJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'user',
        select: 'name email firstName lastName'
      });

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
  // ✅ Get all jobs
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

  // ✅ Get single job
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

  // ✅ Create job
  createJob: (req, res) => {
    Job.create(req.body)
      .then(newJob => res.status(201).json(newJob))
      .catch(err => res.status(400).json({ message: 'Failed to create job', error: err }));
  },

  // ✅ Update job
  updateJob: (req, res) => {
    Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(updatedJob => {
        if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
        res.json(updatedJob);
      })
      .catch(err => res.status(400).json({ message: 'Failed to update job', error: err }));
  },

  // ✅ Delete job
  deleteJob: (req, res) => {
    Job.findByIdAndDelete(req.params.id)
      .then(deletedJob => {
        if (!deletedJob) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
      })
      .catch(err => res.status(500).json({ message: 'Failed to delete job', error: err }));
  },

  // ✅ Jobs by company
  getJobsByCompany: (req, res) => {
    Job.find({ company: req.params.companyId })
      .then(jobs => res.json(jobs))
      .catch(err => res.status(500).json({ message: 'Failed to fetch jobs', error: err }));
  },

  // ✅ User applications
  getUserApplications: async (req, res) => {
    try {
      const userId = req.params.userId;
      const applications = await Application.find({ user: userId })
        .populate('job', 'title')
        .populate('company', 'companyName');

      const userApplications = applications.map(app => ({
        jobId: app.job?._id,
        title: app.job?.title,
        company: app.company?.companyName || "Unknown",
        appliedAt: app.appliedAt,
        status: app.status,
        userId: app.user?._id,
      }));

      res.json(userApplications);
    } catch (err) {
      console.error("Error fetching user applications:", err);
      res.status(500).json({ message: "Failed to fetch applications." });
    }
  },

  // ✅ Apply to job
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

      const job = await Job.findById(jobId).populate('company');
      if (!job) return res.status(404).json({ message: 'Job not found' });

      const existingApplication = await Application.findOne({ job: jobId, user: userId });
      if (existingApplication) {
        return res.status(400).json({ message: 'Already applied to this job' });
      }

      const newApplication = new Application({
        user: userId,
        company: job.company._id,
        job: jobId,
        coverLetter,
        cvPath: cvFile.path,
        cvOriginalName: cvFile.originalname
      });

      const savedApplication = await newApplication.save();

      await Job.findByIdAndUpdate(jobId, { $push: { applications: savedApplication._id } });
      await User.findByIdAndUpdate(userId, { $push: { applications: savedApplication._id } });

      const user = await User.findById(userId);
      const message = `${user.firstName} ${user.lastName} applied to your job: ${job.title}`;

      if (req.io) {
        req.io.to(job.company._id.toString()).emit("newApplication", {
          message,
          jobId,
          userName: user.firstName + " " + user.lastName,
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

  // ✅ Update status route
  updateApplicationStatus,

  // ✅ Applicants for job
  getApplicantsForJob
};
