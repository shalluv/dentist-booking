const Review = require("../models/Review");
const Dentist = require("../models/Dentist");

// @desc    Add a review for a dentist
// @route   POST /api/v1/dentists/:dentistId/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
    try {
      req.body.dentist = req.params.dentistId;
      req.body.user = req.user.id;
  
      const dentist = await Dentist.findById(req.params.dentistId);
      if (!dentist) {
        return res.status(404).json({ success: false, error: "Dentist not found" });
      }
  
      const review = await Review.create(req.body);
  
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(500).json({ success: false, error: "Server error" });
    }
  };