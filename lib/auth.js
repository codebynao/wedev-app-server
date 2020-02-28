const { AuthenticationError } = require('apollo-server-hapi');
const UserModel = require('../models/User');

exports.validate = async credentials => {
  const email = credentials.email;

  if (!email) {
    throw new AuthenticationError('wrong login');
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new AuthenticationError('wrong login');
  }

  return {
    isValid: true
  };
};
