const express = require("express");
const router = express.Router();

// ny användare
router.post("/register", async (req, res) => {
    console.log("Register called...");
});

// login för användare
router.post("/login", async (req, res) => {
    console.log("Login called...");
});

module.exports = router; 