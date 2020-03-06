'use strict';

const ProjectModel = require('./../models/Project');
const { creationSchema, updateSchema } = require('./../schemas/project');
const Joi = require('@hapi/joi');
const stacks = require('./../config/stacks');

class Project {
  async createProject(args) {
    try {
      console.info(args.project);

      Joi.assert(args.project, creationSchema);

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
      return await ProjectModel.findById(args._id);
    } catch (error) {
      console.error('Error getProject', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Project();
