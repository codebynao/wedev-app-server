const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const clientController = require('../controllers/client');
const projectController = require('../controllers/project');
const { AuthenticationError } = require('apollo-server-hapi');

const resolvers = {
  Query: {
    client: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      return clientController.getClient(args, context.user);
    },
    project: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      return projectController.getProject(args);
    },
    user: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      return userController.getUser(args);
    }
  },
  Mutation: {
    userLogin: async (root, args) => authController.login(args),
    userRegister: async (root, args) => userController.createUser(args),
    userDeactivation: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      userController.deactivateUser(args);
    },
    userUpdate: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      userController.updateUser(args);
    },
    clientCreation: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      clientController.createClient(args);
    },
    clientUpdate: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      clientController.updateClient(args);
    },
    clientDeletion: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      clientController.deleteClient(args);
    },
    projectCreation: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      projectController.createProject(args);
    },
    projectUpdate: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      projectController.updateProject(args);
    },
    projectDeletion: async (root, args, context) => {
      if (!context.user) throw new AuthenticationError('Accès non autorisé');
      projectController.deleteProject(args);
    }
  }
};

module.exports = resolvers;
