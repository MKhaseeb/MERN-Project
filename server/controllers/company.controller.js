const Company = require('../models/company.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


module.exports = {

    index: (request, response) => {
        Company.find()
            .then(allCompanies => response.json(allCompanies))
            .catch(err => response.status(400).json(err));
    },

    register: (req, res) => {
        Company.create(req.body)
            .then(company => {
                const companyToken = jwt.sign({
                    id: company._id
                }, process.env.SECRET_KEY);

                res
                    .cookie("companyToken", companyToken, {
                        httpOnly: true
                    })
                    .json({ msg: "success!", company: company });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json({ errors: err.errors });
            });
    },

    login: async (req, res) => {
        const company = await Company.findOne({ email: req.body.email });

        if (company === null) {
            // email not found in users collection
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const correctPassword = await bcrypt.compare(req.body.password, company.password);
        if (!correctPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const companyToken = jwt.sign({
            id: company._id
        }, process.env.SECRET_KEY);

        res
            .cookie("companyToken", companyToken, {
                httpOnly: true
            })
            .json({ msg: "success!", accountType: "company", companyId: company._id });
    },


    logout: (req, res) => {
        res.clearCookie('companyToken');
        res.sendStatus(200);
    }

}

module.exports.getCompany = (request, response) => {
    Company.findOne({ _id: request.params.id })
        .then(Company => response.json(Company))
        .catch(err => response.json(err))
}

module.exports.getApplicationsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const applications = await Application.find({ companyId }); // تأكد من أن اسم الحقل صحيح
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
