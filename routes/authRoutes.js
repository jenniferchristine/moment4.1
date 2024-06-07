const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();

// anslutning
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE).then(() => {
    console.log("Connected to MongoDB...");
}).catch((error) => {
    console.error("Error when connecting to database...");
});

// modell för användare
const User = require("../models/User");

// ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body; // användaruppgifter
        if (!username || !password ) { // validering
            return res.status(400).json({ error: "Invalid input, all fields required" });
        }
        const user = new User({ message: "User created" });
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
});

// login för användare
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body; // inloggningsuppgifter
        if (!username || !password ) { // validering
            return res.status(400).json({ error: "All fields required" });
        }
        if (username === "jeja" && password === "password123") {
        res.status(201).json({ message: "Login successful" });
    } else {
        res.status(401).json({ error: "Invalid username or password"});
    }
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
});

module.exports = router; 