const UserController = require('../controllers/user.controller');
const User = require('../models/User.model');

module.exports = function (app) {
    app.get('/api', UserController.index);
    app.post('/api/register', UserController.register);
    app.post('/api/login', UserController.login);
    app.post('/api/logout', UserController.logout);
    app.get('/api/users/:id', UserController.getUserById);
    app.post('/api/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Logout error:", err);
                return res.status(500).json({ message: "Failed to logout." });
            }

            res.clearCookie('connect.sid'); // ✨ مهم جداً يمسح الكوكي
            res.status(200).json({ message: "Logged out successfully." });
        });
    });

}