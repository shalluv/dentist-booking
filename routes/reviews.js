const express = require("express");
const { addReview } = require("../controllers/reviews");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.route("/").post(protect, authorize("user"), addReview);

module.exports = router;