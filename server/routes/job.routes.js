const { Router } = require('express');
const JobController = require('../controllers/job.controller');

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

    // In routes/job.routes.js
    app.get('/api/jobs/company/:companyId', JobController.getJobsByCompany);

    // routes/job.routes.js or in your controller
    app.get('/api/jobs/user/:userId/applications', JobController.getUserApplications);


};
