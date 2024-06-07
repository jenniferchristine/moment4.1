const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

// routes
app.use("/api", authRoutes);

// skyddad route
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected route..." });
});

// validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) res.status(401).json({ message: "Token missing - Not authorized" })
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
        if (err) return res.status(403).json({ message: "Not correct token" });

        req.username = username;
        next();
    });
}

// starta
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});