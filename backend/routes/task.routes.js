const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/task.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { taskValidation } = require('../middleware/validation.middleware');

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.get('/stats', getTaskStats);

router.route('/:id')
  .get(getTask)
  .put(taskValidation, updateTask)
  .delete(deleteTask);

module.exports = router;