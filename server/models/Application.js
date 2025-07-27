const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    coverLetter: {
        type: String,
        trim: true
    },
    cvPath: {
        type: String,
        required: true
    },
    cvOriginalName: {
        type: String,
        required: true
    },
    appliedAt: {
        type: Date,
        default: () => {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // zero out time
            return now;
        },
        set: v => {
            const d = new Date(v);
            d.setHours(0, 0, 0, 0);
            return d;
        }
    },
    status: {
        type: String,
        enum: ["wishlist", "applied", "interview", "offer", "rejected"],
        default: "applied"
    },

}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);