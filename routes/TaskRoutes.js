const express = require('express');

const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/auth');

const TaskRoutes = express.Router();

TaskRoutes.get('/', authMiddleware, TaskController.getAllTasks);
TaskRoutes.get('/:id', authMiddleware, TaskController.getTaskById);
TaskRoutes.post('/', authMiddleware, TaskController.createTask);
TaskRoutes.delete('/:id', authMiddleware, TaskController.deleteTask);
TaskRoutes.put('/:id', authMiddleware, TaskController.updateTask);

TaskRoutes.get('/:id/comments', authMiddleware, TaskController.getComments);
TaskRoutes.post('/:id/comments', authMiddleware, TaskController.addComment);

module.exports = TaskRoutes;
