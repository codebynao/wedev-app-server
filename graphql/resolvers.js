const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const clientController = require('../controllers/client');

const resolvers = {
  Query: {
    user: async (root, args) => userController.getUser(args)
  },
  Mutation: {
    userDeactivation: async (root, args) => userController.deactivateUser(args),
    userLogin: async (root, args) => authController.login(args),
    userRegister: async (root, args) => userController.createUser(args),
    userUpdate: async (root, args) => userController.updateUser(args),
    clientCreation: async (root, args) => clientController.createClient(args),
    clientUpdate: async (root, args) => clientController.updateClient(args),
    clientDeactivation: async (root, args) =>
      clientController.deactivateClient(args)
  }
};

module.exports = resolvers;
