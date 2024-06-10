const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

// validera token
function authenticateToken(req, res, next) { // middleware-funktion
    const authHeader = req.headers['authorization']; // hämtar värdet 
    const token = authHeader && authHeader.split(' ')[1]; // delar vid mellanslaget och hämtar token

    if (token == null) {
        res.status(401).json({ message: "Token missing - Not authorized" })
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => { // kontroll om giltig token
        if (err) {
            return res.status(403).json({ message: "Not correct token" });
        }
        req.username = username;
        next();
    });
}
/*
// hämta användare
app.get("/home", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); // hämtar id från token
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
*/
// routes
app.use("/api", authRoutes);

app.get("/", async (req, res) => {
    res.json({ message: "Moment 4.1" });
});

// skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected route..." });
});

module.exports = { authenticateToken }; // exportera funktion

// starta
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});