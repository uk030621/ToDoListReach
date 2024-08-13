import express from 'express';
import Task from '../models/Task.js';  // Adjusted import path

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new task
router.post('/', async (req, res) => {
  const newTask = new Task({ text: req.body.text });
  try {
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Move task up
router.put('/:id/move-up', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).send('Task not found');

  const higherPositionTask = await Task.findOne({ position: task.position - 1 });
  if (higherPositionTask) {
    higherPositionTask.position += 1;
    await higherPositionTask.save();
  }

  task.position -= 1;
  await task.save();

  res.send(task);
});

// Move task down
router.put('/:id/move-down', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).send('Task not found');

  const lowerPositionTask = await Task.findOne({ position: task.position + 1 });
  if (lowerPositionTask) {
    lowerPositionTask.position -= 1;
    await lowerPositionTask.save();
  }

  task.position += 1;
  await task.save();

  res.send(task);
});




export default router;

