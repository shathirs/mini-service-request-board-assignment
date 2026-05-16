const express = require("express");

const router = express.Router();

const {
  getJobs,
  getJobById,
  createJob,
  updateJobStatus,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.patch("/:id", updateJobStatus);
router.delete("/:id", deleteJob);

module.exports = router;