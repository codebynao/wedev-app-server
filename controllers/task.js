'use strict';

// Config
const config = require('../config/default');
// Dependencies
const Joi = require('@hapi/joi');
const { AuthenticationError } = require('apollo-server-hapi');
const differenceInMilliseconds = require('date-fns/differenceInMilliseconds');
// Libs
const auth = require('../lib/auth');
// Models
const TaskModel = require('../models/Task');
const ProjectModel = require('../models/Project');
const SprintModel = require('../models/Sprint');
// Schemas
const { creationSchema, updateSchema } = require('../schemas/task');

class Task {
  /**
   * Create a task
   * @param {Object} args - request payload
   * @param {Object} args.task - task to create
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Created task
   */
  async createTask(args, context) {
    try {
      // Check task arguments validity
      Joi.assert(args.task, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Create task
      const task = await TaskModel.create(args.task);

      // Add task to the list of tasks of the project
      await ProjectModel.findByIdAndUpdate(task.project, {
        $addToSet: { tasks: task._id }
      });

      // If a sprint is specified, add the task to the list of tasks of the sprint
      if (task.sprint) {
        await SprintModel.findByIdAndUpdate(task.sprint, {
          $addToSet: { tasks: task._id }
        });
      }
      return task;
    } catch (error) {
      console.error('Error createTask', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Update a task
   * @param {Object} args - request payload
   * @param {Object} args.task - task to update
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Updated task
   */
  async updateTask(args, context) {
    try {
      // Check task arguments validity
      Joi.assert(args.task, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Get old task before updating it
      const oldTask = await TaskModel.findById(args.task._id).lean();

      // Add task to sprint
      if (args.task.sprint && !oldTask.sprint) {
        await SprintModel.findByIdAndUpdate(args.task.sprint, {
          $addToSet: { tasks: args.task._id }
        });
      }

      // If task has been moved from one sprint to another, remove it from old sprint
      if (
        oldTask.sprint &&
        args.task.sprint &&
        oldTask.sprint !== args.task.sprint
      ) {
        await SprintModel.findByIdAndUpdate(oldTask.sprint, {
          $pull: { tasks: args.task._id }
        });
      }

      if (oldTask.status !== args.task.status) {
        switch (args.task.status) {
          case config.PROGRESS_STATUS.NOT_STARTED:
            args.task.startDate = null;
            break;
          case config.PROGRESS_STATUS.WIP:
            args.task.startDate = Date.now();
            break;
          case config.PROGRESS_STATUS.DONE:
            args.task.endDate = Date.now();

            // Calculate the difference in milliseconds
            args.task.completionTime = oldTask.startDate
              ? differenceInMilliseconds(args.task.endDate, oldTask.startDate)
              : 0;
            break;
        }
      }

      // Update task
      return await TaskModel.findByIdAndUpdate(
        args.task._id,
        { $set: args.task },
        { new: true }
      );
    } catch (error) {
      console.error('Error updateTask', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Delete a task
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the task to delete
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Boolean}
   */
  async deleteTask(args, context) {
    try {
      // Find task to get the id of the project it is associated to
      const task = await TaskModel.findById(args._id, 'project sprint').lean();

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !task ||
        !auth.hasProjectPermission(context.user, task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // If task is in a sprint, remove it from the sprint
      if (task.sprint) {
        await SprintModel.findByIdAndUpdate(task.sprint, {
          $pull: { tasks: args._id }
        });
      }

      // Remove the task from the project
      await ProjectModel.findByIdAndUpdate(task.project, {
        $pull: { tasks: args._id }
      });

      // Delete the task
      await TaskModel.deleteOne({ _id: args._id });

      return true;
    } catch (error) {
      console.error('Error deleteTask', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find a task
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the task to find
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Task found
   */
  async getTask(args, context) {
    try {
      // Find task to get the id of the project it is associated to
      const task = await TaskModel.findById(args._id, 'project').lean();

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !task ||
        !auth.hasProjectPermission(context.user, task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find task
      return await TaskModel.findById(args._id);
    } catch (error) {
      console.error('Error getTask', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find all the tasks of a user from all projects
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Sprints found
   */
  async getTasks(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find tasks
      return await TaskModel.find({ project: { $in: context.user.projects } });
    } catch (error) {
      console.error('Error getTasks', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Task();
