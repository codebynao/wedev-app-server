'use strict';

const ProjectModel = require('./../models/Project');
const { creationSchema, updateSchema } = require('./../schemas/project');
const Joi = require('@hapi/joi');
const { AuthenticationError } = require('apollo-server-hapi');
const auth = require('./../lib/auth');

class Project {
  /**
   * Create a project
   * @param {Object} args - request payload
   * @param {Object} args.project - project to create
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Created project
   */
  async createProject(args, context) {
    try {
      // Check project arguments validity
      Joi.assert(args.project, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (!context.user || args.project.user !== context.user._id.toString()) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Create project
      const project = await ProjectModel.create(args.project);

      // Return project populated
      return await project
        .populate({
          path: 'client',
          ref: 'Client'
        })
        .execPopulate();
    } catch (error) {
      console.error('Error createProject', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Update a project
   * @param {Object} args - request payload
   * @param {Object} args.project - project to update
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Updated project
   */
  async updateProject(args) {
    try {
      Joi.assert(args.project, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        auth.hasProjectPermission(context.user, args.project._id)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Update project
      const project = await ProjectModel.findByIdAndUpdate(
        args.project._id,
        { $set: args.project },
        { new: true }
      );

      // Return populate project
      return await project
        .populate({
          path: 'client',
          ref: 'Client'
        })
        .execPopulate();
    } catch (error) {
      console.error('Error updateProject', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Delete a project
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the project to delete
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Boolean}
   */
  async deleteProject(args) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || auth.hasProjectPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Deleting the project means setting 'isDeleted' to true. We are not erasing the project from DB
      await ProjectModel.findByIdAndUpdate(args._id, {
        $set: { isDeleted: true }
      });
      return true;
    } catch (error) {
      console.error('Error deleteProject', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find a project
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the project to find
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Project found
   */
  async getProject(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || auth.hasProjectPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find project
      return await ProjectModel.findById(args._id);
    } catch (error) {
      console.error('Error getProject', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find projects of a user
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Projects found
   */
  async getProjects(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find the projects of the user
      return await ProjectModel.find({ user: context.user._id });
    } catch (error) {
      console.error('Error getProjects', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Project();
