'use strict';

const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const { AuthenticationError } = require('apollo-server-hapi');
const bcrypt = require('bcrypt-nodejs');

class Auth {
  async login(args) {
    try {
      const { email, password } = args;
      const decryptedPwd = crypto.AES.decrypt(
        password,
        process.env.CRYPT_KEY
      ).toString(crypto.enc.Utf8);

      const user = await UserModel.findOne({ email });

      if (!user || !bcrypt.compareSync(decryptedPwd, user.password)) {
        throw new AuthenticationError(
          'Adresse mail ou mot de passe incorrect(e)'
        );
      }

      const token = jwt.sign({ email }, process.env.JWT_KEY, {
        algorithm: 'HS256'
      });

      user.token = token;
      return user;
    } catch (error) {
      console.error('login error =>', error);
      throw new Error(error.message);
    }
  }
}

module.exports = new Auth();
