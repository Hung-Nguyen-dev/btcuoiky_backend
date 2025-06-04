const express = require("express");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const UserRouter = express.Router();
const { verifyToken } = require("../middleware/auth")

UserRouter.get("/list", verifyToken, async (req, res) => {
    try {
        const users = await User.find({}, "_id first_name last_name");
        // Ensure we always return an array, even if empty
        res.json(users || []);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        // Log detailed error stack
        console.error("Error stack:", error.stack);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

UserRouter.get("/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(400).json({ error: "User not found" });
    }
});

UserRouter.post("/", async (req, res) => {
    try {
        const newUser = req.body;
        const user = await User.findOne({ login_name: newUser.login_name })
        if (user) {
            res.status(400).json({ error: "Register failed" })
        } else {
            const createNewUser = await User.create({
                _id: new mongoose.Types.ObjectId().toString(),
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                location: newUser.location,
                description: newUser.description,
                occupation: newUser.occupation,
                login_name: newUser.login_name,
                password: newUser.password
            });

            res.status(200).json({ message: "register success" })
        }

    }
    catch (error) {
        res.status(400).json({ error: "Register failed" })
    }

})
module.exports = UserRouter;