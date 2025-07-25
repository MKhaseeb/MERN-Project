const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salaryRange: {
        type: String
    },
    requirements: {
        type: [String],
        default: []
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    applications: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            appliedAt: { type: Date, default: Date.now },
            coverLetter: String, // Store cover letter
            cvPath: String,     // Path to uploaded CV
            cvOriginalName: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
