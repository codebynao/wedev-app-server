const authController = require('../controllers/auth');
const userController = require('../controllers/user');

const resolvers = {
  Query: {
    user: async (root, args) => userController.getUser(args)
  },
  Mutation: {
    userDeactivation: async (root, args) => userController.deactivateUser(args),
    userLogin: async (root, args) => authController.login(args),
    userRegister: async (root, args) => userController.createUser(args),
    userUpdate: async (root, args) => userController.updateUser(args)
  }
};

module.exports = resolvers;
