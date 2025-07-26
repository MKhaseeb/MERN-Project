const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Company name is required"]
    },
    phonenumber: {
        type: String,
        required: [true, "Phone number is required"]
    },
    details: {
        type: String,
        required: [true, "Details are required"]
    },
    address: {
        country: {
            type: String,
            required: [true, "Country is required"]
        },
        city: {
            type: String,
            required: [true, "City is required"]
        },
        street: {
            type: String,
            required: [true, "Street is required"]
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: {
            validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be 8 characters or longer"]
    },
    website: {
        type: String
    },
    jobListings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, { timestamps: true });

CompanySchema.virtual('confirmPassword')
    .get(function () {
        return this._confirmPassword;
    })
    .set(function (value) {
        this._confirmPassword = value;
    });

CompanySchema.pre('validate', function (next) {
    if (this.isModified('password') && this.password !== this.confirmPassword) {
        this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
});

CompanySchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        })
        .catch(err => next(err));
});

module.exports = mongoose.model('Company', CompanySchema);