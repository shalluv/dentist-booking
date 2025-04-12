const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    year: {
      type: Number,
      required: [true, "Please add a year of experience"],
    },
    area: {
      type: String,
      required: [true, "Please add an area of expertise"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

DentistSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "dentist",
  justOne: false,
});

module.exports = mongoose.model("Dentist", DentistSchema);
