const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('../server/config/mongoose.config');

const app = express();

// ✅ Middleware
app.use(cors({
    credentials: true, // ⬅️ مهم لتمرير الكوكي بين المتصفح والسيرفر
    origin: 'http://localhost:3000',
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
require('./routes/user.routes')(app);
require("./routes/company.routes")(app);
require("./routes/job.routes")(app);

// ✅ Server
app.listen(8000, () => {
    console.log("✅ Listening at Port 8000");
});
