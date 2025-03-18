const mongoose = require("mongoose");

const DentistSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Dentist", DentistSchema);
