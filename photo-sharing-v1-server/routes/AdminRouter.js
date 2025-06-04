const express = require("express");
const User = require("../db/userModel");
const { generateToken, verifyToken, invalidateToken } = require("../middleware/auth");
const AdminRouter = express.Router();

AdminRouter.post("/login", async (req, res) => {
    try {
        const { login_name,password } = req.body;
        
        if (!login_name) {
            return res.status(400).json({ error: "Login name is required" });
        }

        const user = await User.findOne({ login_name, password});
        
        if (!user) {
            return res.status(400).json({ error: "Login failed" });
        }

        const token = generateToken(user);
        
        res.status(200).json({
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(400).json({ error: "Login failed" });
    }
});

AdminRouter.post("/logout", verifyToken, (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: "No token provided" });
        }

        // Invalidate the token
        invalidateToken(token);
        
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(400).json({ error: "Logout failed" });
    }
});

module.exports = AdminRouter;
