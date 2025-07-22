const { User } = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


module.exports = {

    index: (request, response) => {
        User.find()
            .then(allUsers => response.json(allUsers))
            .catch(err => response.status(400).json(err));
    },

    register: (req, res) => {
        User.create(req.body)
            .then(user => {
                const userToken = jwt.sign({
                    id: user._id
                }, process.env.SECRET_KEY);

                res
                    .cookie("usertoken", userToken, {
                        httpOnly: true
                    })
                    .json({ msg: "success!", user: user });
            })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json({ errors: err.errors });
    });
    },

    login: async (req, res) => {
        const user = await User.findOne({ email: req.body.email });

        if (user === null) {
            // email not found in users collection
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // if we made it this far, we found a user with this email address
        // let's compare the supplied password to the hashed password in the database
        const correctPassword = await bcrypt.compare(req.body.password, user.password);

        if (!correctPassword) {
            // password wasn't a match!
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // if we made it this far, the password was correct
        const userToken = jwt.sign({
            id: user._id
        }, process.env.SECRET_KEY);

        // note that the response object allows chained calls to cookie and json
        res
            .cookie("usertoken", userToken, {
                httpOnly: true
            })
            .json({ msg: "success!" });
    },


    logout: (req, res) => {
        res.clearCookie('usertoken');
        res.sendStatus(200);
    }

}

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

