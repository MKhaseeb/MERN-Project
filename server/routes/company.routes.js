const CompanyController = require('../controllers/company.controller');

module.exports = function (app) {
    app.get('/api/company', CompanyController.index);         // Get all companies
    app.get('/api/company/:id', CompanyController.getCompany);         // Get company
    app.post('/api/company/register', CompanyController.register); // Register company
    app.post('/api/company/login', CompanyController.login);       // Login company
    app.post('/api/company/logout', CompanyController.logout);     // Logout company
    app.get('/api/applications/company/:companyId', CompanyController.getApplicationsByCompany);

};
