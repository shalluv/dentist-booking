const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    rating : {
        type: Number,
        required: [true, "Please add a rating"],
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: [true, "Please provide a comment"],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    dentist: {
        type: mongoose.Schema.ObjectId,
        ref: "Dentist",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Review", ReviewSchema);