'use strict';

const ClientModel = require('./../models/Client');
const { creationSchema, updateSchema } = require('./../schemas/client');
const Joi = require('@hapi/joi');

class Client {
  async createClient(args) {
    try {
      Joi.assert(args.client, creationSchema);

      return await ClientModel.create(args.client);
    } catch (error) {
      console.error('Error createClient', error);
      throw new Error(error.message || error);
    }
  }

  async updateClient(args) {
    try {
      Joi.assert(args.client, updateSchema);

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

  async deactivateClient(args) {
    try {
      return await ClientModel.findByIdAndUpdate(
        args._id,
        { $set: { isDeleted: true } },
        { new: true }
      );
    } catch (error) {
      console.error('Error deactivateClient', error);
      throw new Error(error.message || error);
    }
  }

  async getClient(args) {
    try {
      return await ClientModel.findById(args._id);
    } catch (error) {
      console.error('Error getClient', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Client();
