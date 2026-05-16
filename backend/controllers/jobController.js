const JobRequest = require('../models/jobRequest');

const getJobs = async (req, res) => {
    try {
      const filter = {};
  
      if (req.query.category) {
        filter.category = req.query.category;
      }
  
      if (req.query.status) {
        filter.status = req.query.status;
      }

      if (req.query.search) {
        const searchPattern = { $regex: req.query.search, $options: "i" };
        filter.$or = [
          { title: searchPattern },
          { description: searchPattern },
        ];
      }
  
      const jobs = await JobRequest.find(filter).sort({
        createdAt: -1,
      });
  
      res.status(200).json(jobs);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  const getJobById = async (req, res) => {
    try {
      const job = await JobRequest.findById(req.params.id);
  
      if (!job) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
  
      res.status(200).json(job);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  const createJob = async (req, res) => {
    try {
  
      const {
        title,
        description,
        category,
        location,
        contactName,
        contactEmail,
      } = req.body;
  
      const safeTitle = typeof title === "string" ? title.trim() : "";
      const safeDescription =
        typeof description === "string" ? description.trim() : "";

      if (!safeTitle || !safeDescription) {
        return res.status(400).json({
          message: "Title and description are required",
        });
      }

      const trimmedEmail =
        typeof contactEmail === "string" ? contactEmail.trim() : "";

      const newJob = await JobRequest.create({
        title: safeTitle,
        description: safeDescription,
        ...(category ? { category } : {}),
        ...(location ? { location } : {}),
        ...(contactName ? { contactName } : {}),
        ...(trimmedEmail ? { contactEmail: trimmedEmail } : {}),
      });
  
      res.status(201).json(newJob);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  const updateJobStatus = async (req, res) => {
    try {
  
      const { status } = req.body;
  
      if (!["Open", "In Progress", "Closed"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
        });
      }
  
      const updatedJob = await JobRequest.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (!updatedJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
  
      res.status(200).json(updatedJob);
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  const deleteJob = async (req, res) => {
    try {
  
      const deletedJob = await JobRequest.findByIdAndDelete(req.params.id);
  
      if (!deletedJob) {
        return res.status(404).json({
          message: "Job not found",
        });
      }
  
      res.status(200).json({
        message: "Job deleted successfully",
      });
  
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

  module.exports = {
    getJobs,
    getJobById,
    createJob,
    updateJobStatus,
    deleteJob,
  };