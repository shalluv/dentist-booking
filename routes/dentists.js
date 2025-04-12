const express = require("express");
const {
  getDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
  updateAvailability,
} = require("../controllers/dentists");
const bookingRouter = require("./bookings");
const reviewRouter = require("./reviews");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.use("/:dentistId/bookings", bookingRouter);
router.use("/:dentistId/reviews", reviewRouter);

router
  .route("/")
  .get(getDentists)
  .post(protect, authorize("admin"), createDentist);
router
  .route("/:id")
  .get(getDentist)
  .put(protect, authorize("admin"), updateDentist)
  .delete(protect, authorize("admin"), deleteDentist);
router
  .route("/:id/availability")
  .put(protect, authorize("admin", "dentist"), updateAvailability);

module.exports = router;
