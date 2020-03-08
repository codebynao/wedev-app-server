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
