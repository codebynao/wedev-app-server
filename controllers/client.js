'use strict';

const ClientModel = require('./../models/Client');
const { creationSchema, updateSchema } = require('./../schemas/client');
const Joi = require('@hapi/joi');

class Client {
  async createClient(args, context) {
    try {
      // Check client arguments validity
      Joi.assert(args.client, creationSchema);

      // Check if logged in user is authorized to perform this action
      if (!context.user || args.client.user !== context.user._id.toString()) {
        throw new AuthenticationError('Action non autorisée');
      }
      return await ClientModel.create(args.client);
    } catch (error) {
      console.error('Error createClient', error);
      throw new Error(error.message || error);
    }
  }

  async updateClient(args, context) {
    try {
      // Check client arguments validity
      Joi.assert(args.client, updateSchema);

      // Check if logged in user is authorized to perform this action
      if (!context.user || hasClientPermission(context.user, args.client._id)) {
        throw new AuthenticationError('Action non autorisée');
      }

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

  async deleteClient(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || hasClientPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }
      await ClientModel.findByIdAndUpdate(args._id, {
        $set: { isDeleted: true }
      });
      return true;
    } catch (error) {
      console.error('Error deleteClient', error);
      throw new Error(error.message || error);
    }
  }

  async getClient(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user || hasClientPermission(context.user, args._id)) {
        throw new AuthenticationError('Action non autorisée');
      }
      return await ClientModel.findById(args._id);
    } catch (error) {
      console.error('Error getClient', error);
      throw new Error(error.message || error);
    }
  }

  async getClients(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      return await ClientModel.find({ user: context.user._id });
    } catch (error) {
      console.error('Error getClients', error);
      throw new Error(error.message || error);
    }
  }

  hasClientPermission(contextUser, clientId) {
    return (
      contextUser.clients && contextUser.clients.find(id => id === clientId)
    );
  }
}

module.exports = new Client();
