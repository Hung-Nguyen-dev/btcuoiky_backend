const express = require("express");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");
const mongoose = require("mongoose");
const PhotoRouter = express.Router();

PhotoRouter.get("/photosOfUser/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const photos = await Photo.find({ user_id: id });
        if (!photos || photos.length === 0) {
            return res.status(404).json({ error: "No photos found for this user" });
        }

        const result = await Promise.all(photos.map(async (photo) => {
            let comments = [];
            if (photo.comments && photo.comments.length > 0) {
                comments = photo.comments.map((comment) => {
                    return {
                        _id: comment._id,
                        date_time: comment.date_time,
                        comment: comment.comment,
                        user: {
                            _id: comment.user._id,
                            first_name: comment.user.first_name,
                            last_name: comment.user.last_name
                        }
                    };
                });
            }

            return {
                _id: photo._id,
                date_time: photo.date_time,
                file_name: photo.file_name,
                user_id: photo.user_id,
                comments: comments
            };
        }));

        res.json(result);
    } catch (error) {
        console.error("Error fetching photos:", error);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

// Add comment to photo
PhotoRouter.post("/commentsOfPhoto/:photo_id", async (req, res) => {
    const photoId = req.params.photo_id;
    const { comment } = req.body;
    const user = req.user;

    // Validate comment
    if (!comment || comment.trim() === '') {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    try {
        // Find the photo
        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }

        // Find complete user information
        const fullUserInfo = await User.findById(user._id);
        if (!fullUserInfo) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create new comment
        const newComment = {
            _id: new mongoose.Types.ObjectId().toString(), // Convert to string to match schema
            date_time: new Date(),
            comment: comment.trim(),
            user: {
                _id: fullUserInfo._id,
                first_name: fullUserInfo.first_name,
                last_name: fullUserInfo.last_name,
                location: fullUserInfo.location,
                description: fullUserInfo.description,
                occupation: fullUserInfo.occupation,
                login_name: fullUserInfo.login_name
            },
            photo_id: photoId // Add photo_id to match schema
        };

        // Add comment to photo
        photo.comments.push(newComment);
        await photo.save();

        // Return the new comment
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ error: "Failed to add comment" });
    }
});

PhotoRouter.post('/photos/new',async(res,req)=>{
    
})

module.exports = PhotoRouter;