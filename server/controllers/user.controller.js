const User = require('../models/User.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = {
    index: (req, res) => {
        User.find()
            .then(allUsers => res.json(allUsers))
            .catch(err => res.status(400).json(err));
    },

    register: (req, res) => {
        User.create(req.body)
            .then(user => {
                const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

                res
                    .cookie("usertoken", userToken, { httpOnly: true })
                    .json({
                        msg: "success!",
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ errors: err.errors });
            });
    },

    login: async (req, res) => {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const correctPassword = await bcrypt.compare(req.body.password, user.password);

        if (!correctPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        res.cookie("usertoken", userToken, {
            httpOnly: true,
            sameSite: "Lax",
            secure: false
        }).json({
            msg: "success!",
            accountType: "user",
            userId: user._id,
            token: userToken
        });
    },

    logout: (req, res) => {
        res.clearCookie('usertoken');
        res.sendStatus(200);
    },

    // ✅ This is the method you need to fetch user info by ID
    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id).select("firstName lastName email");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (err) {
            console.error("User fetch error:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
};





// module.exports.createAuthor = (request, response) => {
//     const {name } = request.body;
//     Author.create({
//         name
//     })
//     .then(Author => response.json(Author))
//     .catch(err => response.status(400).json(err));
// };

// module.exports.getAuthor = (request, response) => {
//     Author.findOne({_id:request.params.id})
//         .then(Author => response.json(Author))
//         .catch(err => response.json(err))
// }


// module.exports.updateAuthor = (request, response) => {
//     Author.findOneAndUpdate({_id: request.params.id}, request.body, {new:true})
//         .then(updatedAuthor => response.json(updatedAuthor))
//         .catch(err => response.json(err))
// }

// module.exports.deleteAuthor = (request, response) => {
//     Author.deleteOne({ _id: request.params.id })
//         .then(deleteConfirmation => response.json(deleteConfirmation))
//         .catch(err => response.json(err))
// }

