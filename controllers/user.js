'use strict';

// Congig
const config = require('../config/default');
// Dependencies
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const bcrypt = require('bcrypt-nodejs');
const { ApolloError, AuthenticationError } = require('apollo-server-hapi');
// Lib
const Github = require('../lib/github');
// Models
const UserModel = require('../models/User');
// Schemas
const { creationSchema, updateSchema } = require('../schemas/user');

class User {
  /**
   * Create a user
   * @param {Object} args - user properties
   * @returns {Object} created user
   */
  async createUser(args) {
    try {
      const userArgs = args.user;

      // Check user arguments validity
      Joi.assert(userArgs, creationSchema);

      // Check if user with same email already exists
      const userFound = await UserModel.findOne(
        { email: userArgs.email },
        '_id'
      ).lean();

      // Error if user email already exists
      if (userFound) {
        throw new ApolloError(
          'Cette adresse mail est déjà utilisée par un autre utilisateur',
          500,
          { errorLabel: 'user_register_duplicated_email' }
        );
      }

      // Decrypt password
      const decryptedPwd = crypto.AES.decrypt(
        userArgs.password,
        process.env.CRYPT_KEY
      ).toString(crypto.enc.Utf8);

      // Error if password is too short
      if (decryptedPwd.length < config.MINIMUM_LENGTH_PASSWORD) {
        throw new ApolloError(
          `Le mot de passe doit contenir au minimum ${config.MINIMUM_LENGTH_PASSWORD} caractères`,
          500,
          { errorLabel: 'user_register_password_length' }
        );
      }

      // Hash password that will be saved in DB
      const salt = bcrypt.genSaltSync(10);
      const hashedPwd = bcrypt.hashSync(decryptedPwd, salt);
      userArgs.password = hashedPwd;

      // Create the user
      const user = await UserModel.create(userArgs);

      // Generate the user JWT token
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_KEY,
        {
          algorithm: 'HS256'
        }
      );
      user.token = token;

      return user;
    } catch (error) {
      console.error('Error createUser =>', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Get a user
   * @param {Object} args
   * @param {String} args._id - user id
   * @returns {Object} user found
   */
  async getUser(args, context) {
    // Check if logged in user is authorized to perform this action
    if (!context.user || context.user._id.toString() !== args._id) {
      throw new AuthenticationError('Action non autorisée');
    }

    try {
      return await UserModel.findById(args._id);
    } catch (error) {
      console.error('Error getUser =>', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Update a user
   * @param {Object} args - user properties
   * @returns {Object} updated user
   */
  async updateUser(args, context) {
    // Check user arguments validity
    Joi.assert(args.user, updateSchema);

    // Check if logged in user is authorized to perform this action
    if (!context.user || context.user._id.toString() !== args.user._id) {
      throw new AuthenticationError('Action non autorisée');
    }

    // If new github token, get github user login
    if (
      args.user.githubToken &&
      (!context.user.githubToken ||
        context.user.githubToken !== args.user.githubToken)
    ) {
      const github = new Github(args.user.githubToken);
      const info = await github.getUserInfo();
      args.user.githubLogin = info.login;
    }

    try {
      return await UserModel.findByIdAndUpdate(
        args.user._id,
        { $set: args.user },
        { new: true }
      );
    } catch (error) {
      console.error('Error updateUser =>', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Deactivate a user
   * @param {Object} args
   * @param {String} args._id - id of the user to deactivate
   * @returns {Boolean} true if it is successful
   */
  async deactivateUser(args) {
    // Check if logged in user is authorized to perform this action
    if (!context.user || context.user._id.toString() !== args._id) {
      throw new AuthenticationError('Action non autorisée');
    }

    try {
      await UserModel.findByIdAndUpdate(args._id, {
        $set: { isDeactivated: true }
      });
      return true;
    } catch (error) {
      console.error('Error deactivateUser =>', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new User();
