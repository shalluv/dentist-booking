const Booking = require("../models/Booking");
const Dentist = require("../models/Dentist");

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "dentist",
      select: "name",
    });
  } else {
    if (req.params.dentistId) {
      query = Booking.find({ dentist: req.params.dentistId }).populate({
        path: "dentist",
        select: "name year area",
      });
    } else {
      query = Booking.find().populate({
        path: "dentist",
        select: "name year area",
      });
    }
  }

  try {
    const bookings = await query;

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Cannot find Bookings" });
  }
};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "dentist",
      select: "name year area",
    });

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// @desc Add booking
// @route POST /api/v1/dentists/:dentistId/bookings
// @access Private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.dentist = req.params.dentistId;

    const dentist = await Dentist.findById(req.params.dentistId);

    if (!dentist) {
      return res.status(404).json({ success: false });
    }

    req.body.user = req.user.id;
    const existingBooking = await Booking.find({
      user: req.user.id,
    });

    if (existingBooking.length >= 1 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "You can only book 1 bookings",
      });
    }

    if (dentist.autoSchedule) {
      const { bookingDate } = req.body;
      const day = new Date(bookingDate).toLocaleString("en-US", { weekday: "long"}); //to day name
      const availableSlot = dentist.availability.find(
        (slot) => slot.day===day && bookingDate>=slot.startTime && bookingDate<=slot.endTime
      );

    if (!availableSlot) {
      return res.status(400).json({
        success: false,
        error: "Selected booking date is not available for the dentist",
        });
      }
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// @desc Update booking
// @route PUT /api/v1/bookings/:id
// @access Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this booking",
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

// @desc Delete booking
// @route DELETE /api/v1/bookings/:id
// @access Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this booking",
      });
    }

    await booking.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
