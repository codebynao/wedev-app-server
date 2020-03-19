const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

exports.validate = async token => {
  if (!token) {
    return;
  }
  const decoded = jwt.verify(token, process.env.JWT_KEY);

  if (!decoded) {
    return;
  }

  const user = await UserModel.findOne({
    _id: decoded._id,
    email: decoded.email
  }).lean();

  return user;
};

exports.hasProjectPermission = (contextUser, projectId) => {
  return (
    contextUser.projects &&
    contextUser.projects.some(id => id.toString() === projectId.toString())
  );
};

/**
 * Check if user has the permission to update the client
 * @param {Object} contextUser - user authenticated
 * @param {String} clientId
 * @returns {Boolean}
 */
exports.hasClientPermission = (contextUser, clientId) => {
  return contextUser.clients && contextUser.clients.find(id => id === clientId);
};
