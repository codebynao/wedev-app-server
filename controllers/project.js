'use strict';

const ProjectModel = require('./../models/Project');
const { creationSchema, updateSchema } = require('./../schemas/project');
const Joi = require('@hapi/joi');
const stacks = require('./../config/stacks');

class Project {
  async createProject(args, context) {
    try {
      Joi.assert(args.project, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (!context.user || args.project.user !== context.user._id.toString()) {
        throw new AuthenticationError('Action non autorisée');
      }

      const project = await ProjectModel.create(args.project);
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

  async updateProject(args) {
    try {
      Joi.assert(args.project, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        hasProjectPermission(context.user, args.project._id)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      const project = await ProjectModel.findByIdAndUpdate(
        args.project._id,
        { $set: args.project },
        { new: true }
      );
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

  async deleteProject(args) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || hasProjectPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }
      await ProjectModel.findByIdAndUpdate(args._id, {
        $set: { isDeleted: true }
      });
      return true;
    } catch (error) {
      console.error('Error deleteProject', error);
      throw new Error(error.message || error);
    }
  }

  async getProject(args) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || hasProjectPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }
      return await ProjectModel.findById(args._id);
    } catch (error) {
      console.error('Error getProject', error);
      throw new Error(error.message || error);
    }
  }

  async getProjects(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      return await ProjectModel.find({ user: context.user._id });
    } catch (error) {
      console.error('Error getProjects', error);
      throw new Error(error.message || error);
    }
  }

  hasProjectPermission(contextUser, projectId) {
    return (
      contextUser.projects && contextUser.projects.find(id => id === projectId)
    );
  }
}

module.exports = new Project();
