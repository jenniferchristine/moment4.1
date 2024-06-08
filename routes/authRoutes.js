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
    console.error("Error when connecting to database...", error);
});

// modell för användare
const User = require("../models/user");

// ny användare
router.post("/register", async (req, res) => {
    try {
        const { username, password, firstname, lastname, email } = req.body; // användaruppgifter
        if (!username || !password || !firstname || !lastname || !email) { // validering för tomma fält
            return res.status(400).json({ error: "Invalid input - all fields require completion" });
        }
        const user = new User({ username, password, firstname, lastname, email });
        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        if (error.message && error.message.includes(("Username exists"))) { // tar error + meddelande från pre-save funktion för att jämföra
            return res.status(400).json({ error: "This username already exists" }); // om lika meddelande returneras error + meddelande till användare
        } else if (error.message && error.message.includes("Email exists")) {
            return res.status(400).json({ error: "This email is already in use" });
        } else if (error.name === "ValidationError") { // validering från mongoose
            const errors = Object.values(error.errors).map(err => err.message); // tar felmeddelande från schema, gör en array och map:ar dessa för att hämta endast felmeddelandena för ny array som heter errors
            return res.status(400).json({ error: errors }); 
        }
        res.status(500).json({ error: "Server error" });
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
            return res.status(401).json({ error: "Incorrect username or password TEST" });
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) { // kontrollerar matchat lösenord
            return res.status(401).json({ error: "Incorrect username or password TEST" });
        } else {
            const payload =  { username: username }; // jwt med namnet payload
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }); // signerar med nyckel
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