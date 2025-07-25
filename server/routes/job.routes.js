const JobController = require('../controllers/job.controller');
const multer = require('multer');
const bodyParser = require('body-parser'); // Add for form data parsing
const auth = require("../middleware/authenticate");

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = function (app) {
    // Get all jobs
    app.get('/api/jobs', JobController.getAllJobs);

    // Get job by ID
    app.get('/api/jobs/:id', JobController.getJobById);

    // Create a new job
    app.post('/api/jobs', JobController.createJob);

    // Update a job
    app.put('/api/jobs/:id', JobController.updateJob);

    // Delete a job
    app.delete('/api/jobs/:id', JobController.deleteJob);

    // Get jobs by company
    app.get('/api/jobs/company/:companyId', JobController.getJobsByCompany);

    // Get user applications
    app.get('/api/jobs/user/:userId/applications', JobController.getUserApplications);

    // Apply to job with file upload
    app.post(
        "/api/jobs/:jobId/apply",
        auth,                           // Authentication middleware
        bodyParser.urlencoded({ extended: true }), // Parse form data
        upload.single('cv'),            // Handle file upload
        JobController.applyToJob        // Controller
    );
};