const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
        const user = new User({ username, password });
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
        const user = await User.findOne({ username });
        if (!user) { // kontrollera om användaren finns
            return res.status(401).json({ error: "Incorrect username or password"});
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Incorrect username or password" });
        } else {
            const payload =  { username: username };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            const response = {
                message: "Login successful",
                token: token
            }
            res.status(200).json({ response });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
});

module.exports = router; 