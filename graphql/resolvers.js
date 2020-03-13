const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const clientController = require('../controllers/client');
const projectController = require('../controllers/project');

const resolvers = {
  Query: {
    client: async (root, args, context) =>
      clientController.getClient(args, context),
    clients: async (root, args, context) =>
      clientController.getClients(context),
    project: async (root, args, context) =>
      projectController.getProject(args, context),
    projects: async (root, args, context) =>
      projectController.getProjects(context),
    user: async (root, args, context) => userController.getUser(args, context)
  },
  Mutation: {
    userLogin: async (root, args) => authController.login(args),
    userRegister: async (root, args) => userController.createUser(args),
    userDeactivation: async (root, args, context) =>
      userController.deactivateUser(args, context),
    userUpdate: async (root, args, context) =>
      userController.updateUser(args, context),
    clientCreation: async (root, args, context) =>
      clientController.createClient(args, context),
    clientUpdate: async (root, args, context) =>
      clientController.updateClient(args, context),
    clientDeletion: async (root, args, context) =>
      clientController.deleteClient(args, context),
    projectCreation: async (root, args, context) =>
      projectController.createProject(args, context),
    projectUpdate: async (root, args, context) =>
      projectController.updateProject(args, context),
    projectDeletion: async (root, args, context) =>
      projectController.deleteProject(args, context)
  }
};

module.exports = resolvers;
