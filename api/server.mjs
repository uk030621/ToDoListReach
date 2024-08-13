import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import taskRoutes from '../routes/taskroutes.js';  // Adjusted import path

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);  // Using the taskRoutes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
