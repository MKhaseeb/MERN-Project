// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.model'); // أو حسب المسار عندك

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // أو اجلب المستخدم من قاعدة البيانات إذا بتحب
        console.log("✅ Token valid, user:", req.user);
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateJWT;
