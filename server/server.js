const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
require('../server/config/mongoose.config');
const path = require('path');  // For static uploads
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// ✅ Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

// ✅ Attach io to every request
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ✅ Middleware
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
require('./routes/user.routes')(app);
require("./routes/company.routes")(app);
require("./routes/job.routes")(app);

// ✅ Socket.IO connection handler
io.on('connection', (socket) => {
    console.log("🔌 A client connected:", socket.id);

    socket.on("registerCompany", (companyId) => {
        socket.join(companyId); // Company joins a room with its ID
        console.log(`🏢 Company ${companyId} joined room`);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
    });
});

// ✅ Start server
server.listen(8000, () => {
    console.log("✅ Server is running on http://localhost:8000");
});
