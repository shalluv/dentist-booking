const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
    },
    year: {
      type: Number,
      required: [true, "Please add a year of experience"],
    },
    area: {
      type: String,
      required: [true, "Please add an area of expertise"],
    },
    autoSchedule: {
      type: Boolean,
      default: false,
    },
    availability: [
      {
        day: {
          type: String,
          enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
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

DentistSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "dentist",
  justOne: false,
});


module.exports = mongoose.model("Dentist", DentistSchema);
