const express = require("express");
const cors = require("cors");
const jobRoutes = require("./routes/jobRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

app.use(errorHandler);

module.exports = app;
