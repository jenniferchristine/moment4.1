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

// routes
app.use("/api", authRoutes);

app.get("/", async (req, res) => {
    res.json({ message: "Moment 4.1" });
});

// skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected route..." });
});

// validera token
function authenticateToken(req, res, next) { // middleware-funktion
    const authHeader = req.headers['authorization']; // hämtar värdet 
    const token = authHeader && authHeader.split(' ')[1]; // delar vid mellanslaget och hämtar token

    if (token == null) res.status(401).json({ message: "Token missing - Not authorized" })
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => { // kontroll om giltig token
        if (err) return res.status(403).json({ message: "Not correct token" });

        req.username = username;
        next();
    });
}

module.exports = { authenticateToken }; // exportera funktion

// starta
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});