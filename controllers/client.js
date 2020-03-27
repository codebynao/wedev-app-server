'use strict';

const ClientModel = require('./../models/Client');
const ProjectModel = require('./../models/Project');
const { creationSchema, updateSchema } = require('./../schemas/client');
const Joi = require('@hapi/joi');
const { AuthenticationError } = require('apollo-server-hapi');
const auth = require('./../lib/auth');

class Client {
  /**
   * Create a client
   * @param {Object} args - request payload
   * @param {Object} args.client - client to create
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Created client
   */
  async createClient(args, context) {
    try {
      // Check client arguments validity
      Joi.assert(args.client, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (!context.user || args.client.user !== context.user._id.toString()) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Create client
      return await ClientModel.create(args.client);
    } catch (error) {
      console.error('Error createClient', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Update a client
   * @param {Object} args - request payload
   * @param {Object} args.client - client to update
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - updated client
   */
  async updateClient(args, context) {
    try {
      // Check client arguments validity
      Joi.assert(args.client, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        auth.hasClientPermission(context.user, args.client._id)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Update client
      return await ClientModel.findByIdAndUpdate(
        args.client._id,
        { $set: args.client },
        { new: true }
      );
    } catch (error) {
      console.error('Error updateClient', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Delete a client
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the client to delete
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Boolean}
   */
  async deleteClient(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || auth.hasClientPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Deleting the client means setting 'isDeleted' to true. We are not erasing the client from DB
      await ClientModel.findByIdAndUpdate(args._id, {
        $set: { isDeleted: true }
      });

      // Deactivate client's projects
      await ProjectModel.updateMany(
        { client: args._id },
        { $set: { isDeleted: true } }
      );
      return true;
    } catch (error) {
      console.error('Error deleteClient', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find a client
   * @param {Object} args - request payload
   * @param {Object} args._id - id of the client to find
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Client found
   */
  async getClient(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || auth.hasClientPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find client
      return await ClientModel.findById(args._id).populate({
        path: 'projects',
        ref: 'Project'
      });
    } catch (error) {
      console.error('Error getClient', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Find clients of a user
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Clients found
   */
  async getClients(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Find clients of this user
      return await ClientModel.find({
        user: context.user._id,
        isDeleted: { $ne: true }
      }).populate({
        path: 'projects',
        ref: 'Project'
      });
    } catch (error) {
      console.error('Error getClients', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Client();
