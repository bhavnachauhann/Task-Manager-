const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file
const app = express();

app.use(express.json());
app.use(cors());

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: { type: String, enum: ['high', 'medium', 'low'] },
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', TaskSchema);

// API routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

const PORT = process.env.PORT || 5000; // Use PORT from .env or fallback to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
