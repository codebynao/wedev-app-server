'use strict';

const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const bcrypt = require('bcrypt-nodejs');
const { ApolloError } = require('apollo-server-hapi');
const config = require('../config/default');

class User {
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

      // Error if user email doesn't have a correct format
      if (!config.REGEX.EMAIL.test(args.email)) {
        throw new ApolloError("Mauvais format d'adresse mail", 500, {
          errorLabel: 'user_register_incorrect_email_format'
        });
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

      // Hash password that will be saved in DB
      const salt = bcrypt.genSaltSync(10);
      const hashedPwd = bcrypt.hashSync(decryptedPwd, salt);
      args.password = hashedPwd;

      // Error if siret number has a wrong format
      if (
        args.siret &&
        args.siret.length !== config.LENGTH_SIRET &&
        !config.REGEX.NUMBERS_ONLY.test(args.siret)
      ) {
        throw new ApolloError(`Mauvais format de numéro de SIRET`, 500, {
          errorLabel: 'user_register_incorrect_siret_format'
        });
      }

      // Error if company status not in predefined list
      const companyStatusConfig = Object.values(config.COMPANY_STATUS);
      if (
        args.companyStatus &&
        !companyStatusConfig.includes(args.companyStatus)
      ) {
        throw new ApolloError(`Statut de société inconnu`, 500, {
          errorLabel: 'user_register_unknown_company_status'
        });
      }

      // Error if professional status not in predefined list
      const professionalStatusConfig = Object.values(
        config.PROFESSIONAL_STATUS
      );
      if (
        args.professionalStatus &&
        !professionalStatusConfig.includes(args.professionalStatus)
      ) {
        throw new ApolloError(`Statut professionnel inconnu`, 500, {
          errorLabel: 'user_register_unknown_professional_status'
        });
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
}

module.exports = new User();
