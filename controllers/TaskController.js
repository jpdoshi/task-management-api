const TaskModel = require('../models/TaskModel');

const getAllTasks = async (req,  res) => {
  try {
    const tasks = await TaskModel.find({
      user: req.user._id
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
}

const getTaskById = async (req, res) => {
  try {
    const tasks = await TaskModel
      .findById(req.params.id);

    if (tasks.user == req.user._id) {
      res.json(tasks);
    } else {
      res.status(404).json({});
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

const createTask = async (req, res) => {
  try {
    const tasks = await TaskModel
      .create({user: req.user._id, ...req.body});

    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
}

const updateTask = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task && task.user == req.user._id) {
      task = await TaskModel
        .findByIdAndUpdate(
          task._id, req.body, { new: 1 }
        );
      
      res.json(task);
    } else {
      res.status(404).send('Task Not Found!');
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

const deleteTask = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task && task.user == req.user._id) {
      task = await TaskModel
        .findByIdAndDelete(task._id, req.body);
      
      res.json(task);
    } else {
      res.status(404).send('Task Not Found!');
    }
  } catch (err) {
    res.status(500).send(err);
  }
}

const TaskController = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};

module.exports = TaskController;