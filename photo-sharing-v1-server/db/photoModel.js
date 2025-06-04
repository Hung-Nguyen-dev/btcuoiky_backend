const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    _id: String,
    date_time: Date,
    comment: String,
    user: Object,
    photo_id: String
});
const photoSchema = new mongoose.Schema({
    _id: String,
    date_time: Date,
    file_name: String,
    user_id: String,
    comments: [commentSchema]
});
module.exports = mongoose.model.Photos || mongoose.model("Photos", photoSchema);