'use strict';

const ProjectModel = require('./../models/Project');
const SprintModel = require('./../models/Sprint');
const TaskModel = require('./../models/Task');

const { creationSchema, updateSchema } = require('./../schemas/sprint');
const Joi = require('@hapi/joi');

const { AuthenticationError } = require('apollo-server-hapi');
const auth = require('./../lib/auth');

class Sprint {
  /**
   * Create a sprint
   * @param {Object} args - request payload
   * @param {Object} args.sprint - sprint to create
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Created sprint
   */
  async createSprint(args, context) {
    try {
      // Check sprint arguments validity
      Joi.assert(args.sprint, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Create sprint
      const sprint = await SprintModel.create(args.sprint);

      // Add sprint to project's list of sprints
      await ProjectModel.findByIdAndUpdate(sprint.project, {
        $addToSet: { sprints: sprint._id }
      });

      return sprint;
    } catch (error) {
      console.error('Error createSprint', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Update a sprint
   * @param {Object} args - request payload
   * @param {Object} args.sprint - sprint to update
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Updated sprint
   */
  async updateSprint(args, context) {
    try {
      // Check sprint arguments validity
      Joi.assert(args.sprint, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Get old sprint before updating it
      const oldSprint = await SprintModel.findById(args.sprint._id).lean();

      // Check if the list of tasks has been updated
      for (const task of oldSprint.tasks) {
        const ids = args.sprint.tasks.map(task => task.toString());
        if (ids.includes(task.toString())) {
          continue;
        }

        // If task has been removed from the sprint, remove sprint id from the task
        await TaskModel.findByIdAndUpdate(task, {
          $set: { sprint: undefined }
        });
      }

      // Return updated sprint
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

  /**
   * Delete a sprint
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the sprint to delete
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Boolean}
   */
  async deleteSprint(args, context) {
    try {
      // Find sprint to get the id of the project it is associated to
      const sprint = await SprintModel.findById(args._id, 'project').lean();

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !sprint ||
        !auth.hasProjectPermission(context.user, sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Remove the sprint from the list of sprints of the project
      await ProjectModel.findById(sprint.project, {
        $pull: {
          sprints: args._id
        }
      });

      // Delete the sprint
      await SprintModel.deleteOne({ _id: args._id });

      return true;
    } catch (error) {
      console.error('Error deleteSprint', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find a sprint
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the sprint to find
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Sprint found
   */
  async getSprint(args, context) {
    try {
      // Find sprint to get the id of the project it is associated to
      const sprint = await SprintModel.findById(args._id, 'project').lean();

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !sprint ||
        !auth.hasProjectPermission(context.user, sprint.project)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find sprint
      return await SprintModel.findById(args._id).populate([
        {
          path: 'project',
          select: 'title description status client',
          populate: {
            path: 'client',
            select: 'corporateName'
          }
        },
        {
          path: 'tasks'
        }
      ]);
    } catch (error) {
      console.error('Error getSprint', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find all the sprints of a user from all projects
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Sprints found
   */
  async getSprints(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find sprints
      return await SprintModel.find({
        project: { $in: context.user.projects }
      }).populate([
        {
          path: 'project',
          select: 'title description status client',
          populate: {
            path: 'client',
            select: 'corporateName'
          }
        },
        {
          path: 'tasks'
        }
      ]);
    } catch (error) {
      console.error('Error getSprints', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Sprint();
