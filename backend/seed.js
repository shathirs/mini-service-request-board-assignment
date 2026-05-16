const mongoose = require("mongoose");
require("dotenv").config();

const JobRequest = require("./models/jobRequest");

const jobs = [
  {
    title: "Fix leaking kitchen tap",
    description: "Water is dripping continuously from the tap.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "John Doe",
    contactEmail: "john@example.com",
    status: "Open",
  },
  {
    title: "Install ceiling fan",
    description: "Need electrician to install a new fan.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Sarah",
    contactEmail: "sarah@example.com",
    status: "Open",
  },
  {
    title: "Paint living room",
    description: "Walls need repainting in white color.",
    category: "Painting",
    location: "London",
    contactName: "David",
    contactEmail: "david@example.com",
    status: "Open",
  },
  {
    title: "Fix broken door",
    description: "Wooden door hinge is broken.",
    category: "Joinery",
    location: "Manchester",
    contactName: "Michael",
    contactEmail: "michael@example.com",
    status: "In Progress",
  },
  {
    title: "Bathroom pipe repair",
    description: "Pipe leakage under sink.",
    category: "Plumbing",
    location: "Birmingham",
    contactName: "Emma",
    contactEmail: "emma@example.com",
    status: "Closed",
  },
];

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in backend/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");

    await JobRequest.deleteMany();
    await JobRequest.insertMany(jobs);

    console.log("Sample jobs inserted!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
