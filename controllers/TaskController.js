const TaskModel = require('../models/TaskModel');

const getAllTasks = async (req,  res) => {
  try {
    const tasks = await TaskModel.find({
      user: req.user._id
    });

    res.json(tasks);
  } catch (err) {
    next(err);
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
    next(err);
  }
}

const createTask = async (req, res) => {
  try {
    const task = await TaskModel
      .create({user: req.user._id, ...req.body});

    req.app.io.emit('taskCreate', { msg: 'Task Updated!', task });
    res.json(task);
  } catch (err) {
    next(err);
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

      req.app.io.emit('taskUpdate', { msg: 'Task Updated!', task });
      res.json(task);
    } else {
      res.status(404).send('Task Not Found!');
    }
  } catch (err) {
    next(err);
  }
}

const deleteTask = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task && task.user == req.user._id) {
      task = await TaskModel
        .findByIdAndDelete(task._id, req.body);
      
      req.app.io.emit('taskDelete', { msg: 'Task Deleted!', task });
      res.json(task);
    } else {
      res.status(404).send('Task Not Found!');
    }
  } catch (err) {
    next(err);
  }
}

const getComments = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task) {
      res.json(task.comments);
    } else {
      res.status(404).json({});
    }
  } catch (err) {
    next(err);
  }
}

const addComment = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task) {
      let comments = task.comments;
      comments.push({ user: req.user._id, text: req.body.comment });

      task = await TaskModel
        .findByIdAndUpdate(task._id, { comments }, { new: true });

      req.app.io.emit('newComment', { msg: 'Comment Added!', comment: req.body.comment });
      res.json(task);
    } else {
      res.status(404).json({});
    }
  } catch (err) {
    next(err);
  }
}

const TaskController = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getComments,
  addComment
};

module.exports = TaskController;