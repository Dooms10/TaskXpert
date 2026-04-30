const express = require('express');
const router = express.Router();

// Mock Task Schema (you'll need to create proper Firestore models)
const Task = {
  async find() {
    // Mock implementation - replace with Firestore logic
    return [
      { _id: '1', title: 'Sample Task 1', completed: false },
      { _id: '2', title: 'Sample Task 2', completed: true }
    ];
  },
  async create(taskData) {
    // Mock implementation - replace with Firestore logic
    return { _id: 'new-id', ...taskData };
  },
  async findById(id) {
    // Mock implementation - replace with Firestore logic
    return { _id: id, title: 'Task ' + id, completed: false };
  },
  async findByIdAndUpdate(id, updateData) {
    // Mock implementation - replace with Firestore logic
    return { _id: id, ...updateData };
  },
  async findByIdAndDelete(id) {
    // Mock implementation - replace with Firestore logic
    return { _id: id };
  }
};

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create task
router.post('/', async (req, res) => {
  try {
    const { title, description, completed } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const task = await Task.create({
      title,
      description: description || '',
      completed: completed || false
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      completed
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
