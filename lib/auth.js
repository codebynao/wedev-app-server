const { AuthenticationError } = require('apollo-server-hapi');
const Models = require('../models');
const UserModel = Models.user;

exports.validate = async credentials => {
  const email = credentials.email;

  if (!email) {
    throw new AuthenticationError('wrong login');
  }

  const user = await UserModel.findOne({ where: { email } });

  if (!user) {
    throw new AuthenticationError('wrong login');
  }

  return {
    isValid: true
  };
};
