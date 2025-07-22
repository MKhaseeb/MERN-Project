const mongoose = require('mongoose');


const dbName = process.env.DB;

const username = process.env.ATLAS_USERNAME;

const pw = process.env.ATLAS_PASSWORD;

const uri = `mongodb+srv://${username}:${encodeURIComponent(pw)}@khaseeb.zfuefck.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Khaseeb`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log("✅ Connected to the database"))
    .catch(err => console.error("❌ DB connection error:", err));