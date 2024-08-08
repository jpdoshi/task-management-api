const express = require('express');
const TaskController = require('../controllers/TaskController');

const TaskRoutes = express.Router();

TaskRoutes.get('/', TaskController.getAllTasks);
TaskRoutes.get('/:id', TaskController.getTaskById);
TaskRoutes.post('/', TaskController.createTask);
TaskRoutes.delete('/:id', TaskController.deleteTask);
TaskRoutes.put('/:id', TaskController.updateTask);

module.exports = TaskRoutes;
