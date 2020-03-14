'use strict';

const TaskModel = require('./../models/Task');
const ProjectModel = require('./../models/Project');
const SprintModel = require('./../models/Sprint');
const { creationSchema, updateSchema } = require('./../schemas/task');
const Joi = require('@hapi/joi');

const { AuthenticationError } = require('apollo-server-hapi');
const auth = require('./../lib/auth');

class Task {
  async createTask(args, context) {
    try {
      Joi.assert(args.task, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      const task = await TaskModel.create(args.task);
      await ProjectModel.findByIdAndUpdate(task.project, {
        $addToSet: { tasks: task._id }
      });

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

  async updateTask(args, context) {
    try {
      Joi.assert(args.task, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      const oldTask = await TaskModel.findById(args.task._id).lean();

      if (
        oldTask.sprint &&
        args.task.sprint &&
        oldTask.sprint !== args.task.sprint
      ) {
        await SprintModel.findByIdAndUpdate(oldTask.sprint, {
          $pull: { tasks: args.task._id }
        });
        await SprintModel.findByIdAndUpdate(args.task.sprint, {
          $addToSet: { tasks: args.task._id }
        });
      }

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

  async deleteTask(args, context) {
    try {
      const task = await TaskModel.findById(args._id, 'project sprint').lean();
      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !task ||
        !auth.hasProjectPermission(context.user, task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      if (task.sprint) {
        await SprintModel.findByIdAndUpdate(task.sprint, {
          $pull: { tasks: args._id }
        });
      }

      await ProjectModel.findByIdAndUpdate(task.project, {
        $pull: { tasks: args._id }
      });

      await TaskModel.deleteOne({ _id: args._id });

      return true;
    } catch (error) {
      console.error('Error deleteTask', error);
      throw new Error(error.message || error);
    }
  }

  async getTask(args, context) {
    try {
      const task = await TaskModel.findById(args._id, 'project').lean();
      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !task ||
        !auth.hasProjectPermission(context.user, task.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }
      return await TaskModel.findById(args._id);
    } catch (error) {
      console.error('Error getTask', error);
      throw new Error(error.message || error);
    }
  }

  async getTasks(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      return await TaskModel.find({ project: { $in: context.user.projects } });
    } catch (error) {
      console.error('Error getTasks', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Task();
