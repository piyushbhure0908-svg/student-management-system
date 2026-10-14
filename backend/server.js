const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Student routes — must be registered before the server starts
app.use("/api/students", require("./routes/studentRoutes"));

app.get("/", (req, res) => {
    res.send("Student Management System Backend is Running!");
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is working properly!"
    });
});

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "studentDB"
        });

        console.log("MongoDB Atlas connected successfully!");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

startServer();