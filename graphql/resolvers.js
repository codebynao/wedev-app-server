const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const clientController = require('../controllers/client');
const projectController = require('../controllers/project');

const resolvers = {
  Query: {
    client: async (root, args) => clientController.getClient(args),
    project: async (root, args) => projectController.getProject(args),
    user: async (root, args) => userController.getUser(args)
  },
  Mutation: {
    userDeactivation: async (root, args) => userController.deactivateUser(args),
    userLogin: async (root, args) => authController.login(args),
    userRegister: async (root, args) => userController.createUser(args),
    userUpdate: async (root, args) => userController.updateUser(args),
    clientCreation: async (root, args) => clientController.createClient(args),
    clientUpdate: async (root, args) => clientController.updateClient(args),
    clientDeletion: async (root, args) => clientController.deleteClient(args),
    projectCreation: async (root, args) =>
      projectController.createProject(args),
    projectUpdate: async (root, args) => projectController.updateProject(args),
    projectDeletion: async (root, args) => projectController.deleteProject(args)
  }
};

module.exports = resolvers;
