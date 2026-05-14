const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');
const errorHandler = require('./middleware/errorMiddleware');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes);

app.use((req, res) => {
    res.status(404).json({
      message: "Route Not Found",
    });
  });

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

connectDB();