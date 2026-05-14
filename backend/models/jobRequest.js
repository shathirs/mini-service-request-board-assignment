const mongoose = require("mongoose");
const validator = require("validator");

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
  },

  location: {
    type: String,
  },

  contactName: {
    type: String,
  },

  contactEmail: {
    type: String,
    validate: [validator.isEmail, "Invalid email"],
  },

  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed"],
    default: "Open",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobRequest", jobRequestSchema);