const TaskModel = require('../models/TaskModel');

const getAllTasks = async (req,  res) => {
  try {
    const tasks = await TaskModel.find({
      user: req.user._id
    });

    res.json({
      statusCode: 200,
      success: true,
      data: tasks
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const getTaskById = async (req, res) => {
  try {
    const task = await TaskModel
      .findById(req.params.id);

    if (task) {
      res.json({
        statusCode: 200,
        success: true,
        data: task
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        error: 'Could Not Find Task'
      });
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const createTask = async (req, res) => {
  try {
    const task = await TaskModel
      .create({user: req.user._id, ...req.body});

    req.app.io.to(req.app.onlineUsers[(req.user._id).toString()]).emit('taskCreate', { msg: 'Task Created!', task });
    res.json({
      statusCode: 201,
      success: true,
      data: task
    });
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
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

      req.app.io.to(req.app.onlineUsers[(req.user._id).toString()]).emit('taskUpdate', { msg: 'Task Updated!', task });
      res.json(task);
    } else {
      res.status(404).send({
        statusCode: 404,
        success: false,
        error: 'Task Not Found!'
      });
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const deleteTask = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task && task.user == req.user._id) {
      task = await TaskModel
        .findByIdAndDelete(task._id, req.body);
      
      req.app.io.to(req.app.onlineUsers[(req.user._id).toString()]).emit('taskDelete', { msg: 'Task Deleted!', task });
      res.json({
        statusCode: 200,
        success: true,
        data: task
      });
    } else {
      res.status(404).send({
        statusCode: 404,
        success: false,
        error: 'Task Not Found!'
      });
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const getComments = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task) {
      res.json({
        statusCode: 200,
        success: true,
        data: task.comments
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        error: 'Could Not Find Task'
      });
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
  }
}

const addComment = async (req, res) => {
  try {
    let task = await TaskModel
      .findById(req.params.id);

    if (task && req.body.comment) {
      let comments = task.comments;
      comments.push({ user: req.user._id, text: req.body.comment });

      task = await TaskModel
        .findByIdAndUpdate(task._id, { comments }, { new: true });

      req.app.io.to(req.app.onlineUsers[(req.user._id).toString()]).emit('newComment', { msg: 'Comment Added!', comment: req.body.comment });
      res.json({
        statusCode: 201,
        success: true,
        data: task
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        error: 'Could Not Create Comment'
      });
    }
  } catch (error) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      error
    });
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
