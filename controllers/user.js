'use strict';

const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const bcrypt = require('bcrypt-nodejs');
const { ApolloError } = require('apollo-server-hapi');
const config = require('../config/default');

class User {
  /**
   * Check the validity of a user's properties value
   * @param {Object} args - user properties
   * @returns {ApolloError|null}
   */
  checkUserProperties(args) {
    // Error if user email doesn't have a correct format
    if (!config.REGEX.EMAIL.test(args.email)) {
      return new ApolloError("Mauvais format d'adresse mail", 500, {
        errorLabel: 'user_register_incorrect_email_format'
      });
    }

    // Error if siret number has a wrong format
    if (
      args.siret &&
      args.siret.length !== config.LENGTH_SIRET &&
      !config.REGEX.NUMBERS_ONLY.test(args.siret)
    ) {
      return new ApolloError(`Mauvais format de numéro de SIRET`, 500, {
        errorLabel: 'user_register_incorrect_siret_format'
      });
    }

    // Error if company status not in predefined list
    const companyStatusConfig = Object.values(config.COMPANY_STATUS);
    if (
      args.companyStatus &&
      !companyStatusConfig.includes(args.companyStatus)
    ) {
      return new ApolloError(`Statut de société inconnu`, 500, {
        errorLabel: 'user_register_unknown_company_status'
      });
    }

    // Error if professional status not in predefined list
    const professionalStatusConfig = Object.values(config.PROFESSIONAL_STATUS);
    if (
      args.professionalStatus &&
      !professionalStatusConfig.includes(args.professionalStatus)
    ) {
      return new ApolloError(`Statut professionnel inconnu`, 500, {
        errorLabel: 'user_register_unknown_professional_status'
      });
    }

    return;
  }

  /**
   * Create a user
   * @param {Object} args - user properties
   * @returns {Object} created user
   */
  async createUser(args) {
    try {
      // Check if user with same email already exists
      const userFound = await UserModel.findOne({ email: args.email });

      // Error if user email already exists
      if (userFound) {
        throw new ApolloError(
          'Cette adresse mail est déjà utilisée par un autre utilisateur',
          500,
          { errorLabel: 'user_register_duplicated_email' }
        );
      }

      // Check if a property value is incorrect
      const error = this.checkUserProperties(args);

      if (error) {
        throw error;
      }

      // Decrypt password
      const decryptedPwd = crypto.AES.decrypt(
        args.password,
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

      // Create the user
      const user = await UserModel.create(args);

      // Generate the user JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, {
        algorithm: 'HS256'
      });
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
  async getUser(args) {
    if (!args._id) {
      throw new UserInputError('Identifiant manquant', {
        invalidArgs: ['_id']
      });
    }

    try {
      return await UserModel.findById(args._id);
    } catch (error) {
      console.error('Error createUser =>', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Update a user
   * @param {Object} args - user properties
   * @returns {Object} updated user
   */
  async updateUser(args) {
    if (!args._id) {
      throw new UserInputError('Identifiant manquant', {
        invalidArgs: ['_id']
      });
    }

    // Check if a property value is incorrect
    const error = this.checkUserProperties(args);
    console.info('error', error);
    if (error) {
      throw error;
    }

    try {
      console.info('args', args);
      return await UserModel.findByIdAndUpdate(
        args._id,
        { $set: args },
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
    if (!args._id) {
      throw new UserInputError('Identifiant manquant', {
        invalidArgs: ['_id']
      });
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
