import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  position: { type: Number, required: true, default: 0 },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
