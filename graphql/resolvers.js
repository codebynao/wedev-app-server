const authController = require('../controllers/auth');
const userController = require('../controllers/user');

const resolvers = {
  Mutation: {
    userLogin: async (root, args) => authController.login(args),
    userRegister: async (root, args) => userController.createUser(args)
  }
};

module.exports = resolvers;
