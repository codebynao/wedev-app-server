'use strict';

const ProjectModel = require('./../models/Project');
const SprintModel = require('./../models/Sprint');
const TaskModel = require('./../models/Task');

const { creationSchema, updateSchema } = require('./../schemas/sprint');
const Joi = require('@hapi/joi');

const { AuthenticationError } = require('apollo-server-hapi');
const auth = require('./../lib/auth');

class Sprint {
  async createSprint(args, context) {
    try {
      Joi.assert(args.sprint, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      const sprint = await SprintModel.create(args.sprint);
      await ProjectModel.findByIdAndUpdate(sprint.project, {
        $addToSet: { sprints: sprint._id }
      });

      return sprint;
    } catch (error) {
      console.error('Error createSprint', error);
      throw new Error(error.message || error);
    }
  }

  async updateSprint(args, context) {
    try {
      Joi.assert(args.sprint, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      const oldSprint = await SprintModel.findById(args.sprint._id).lean();

      for (const task of oldSprint.tasks) {
        const ids = args.sprint.tasks.map(task => task.toString());
        if (ids.includes(task.toString())) {
          continue;
        }
        await TaskModel.findByIdAndUpdate(task, {
          $set: { sprint: undefined }
        });
      }

      return await SprintModel.findByIdAndUpdate(
        args.sprint._id,
        { $set: args.sprint },
        { new: true }
      );
    } catch (error) {
      console.error('Error updateSprint', error);
      throw new Error(error.message || error);
    }
  }

  async deleteSprint(args, context) {
    try {
      const sprint = await SprintModel.findById(args._id, 'project').lean();
      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !sprint ||
        !auth.hasProjectPermission(context.user, sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      await ProjectModel.findById(sprint.project, {
        $pull: {
          sprints: args._id
        }
      });

      await SprintModel.deleteOne({ _id: args._id });

      return true;
    } catch (error) {
      console.error('Error deleteSprint', error);
      throw new Error(error.message || error);
    }
  }

  async getSprint(args, context) {
    try {
      const sprint = await SprintModel.findById(args._id, 'project').lean();

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !sprint ||
        !auth.hasProjectPermission(context.user, sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }
      return await SprintModel.findById(args._id).populate('tasks');
    } catch (error) {
      console.error('Error getSprint', error);
      throw new Error(error.message || error);
    }
  }

  async getSprints(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      return await SprintModel.find({
        project: { $in: context.user.projects }
      }).populate('tasks');
    } catch (error) {
      console.error('Error getSprints', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Sprint();
