const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    salaryRange: String,
    requirements: [String],
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    applications: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            appliedAt: { type: Date, default: Date.now }
        }
    ]
});
module.exports = mongoose.model('Job', JobSchema);
