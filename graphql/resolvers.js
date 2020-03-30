const authController = require('../controllers/auth');
const userController = require('../controllers/user');
const clientController = require('../controllers/client');
const metricsController = require('../controllers/metrics');
const projectController = require('../controllers/project');
const sprintController = require('../controllers/sprint');
const taskController = require('../controllers/task');
const repositoryController = require('../controllers/repository');

const resolvers = {
  Query: {
    client: async (root, args, context) =>
      clientController.getClient(args, context),
    clients: async (root, args, context) =>
      clientController.getClients(context),
    metrics: async (root, args, context) =>
      metricsController.getMetrics(context),
    project: async (root, args, context) =>
      projectController.getProject(args, context),
    projects: async (root, args, context) =>
      projectController.getProjects(context),
    repositories: async (root, args, context) =>
      repositoryController.getReposList(context),
    sprint: async (root, args, context) =>
      sprintController.getSprint(args, context),
    sprints: async (root, args, context) =>
      sprintController.getSprints(context),
    task: async (root, args, context) => taskController.getTask(args, context),
    tasks: async (root, args, context) =>
      taskController.getTasks(args, context),
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
      projectController.deleteProject(args, context),
    sprintCreation: async (root, args, context) =>
      sprintController.createSprint(args, context),
    sprintUpdate: async (root, args, context) =>
      sprintController.updateSprint(args, context),
    sprintDeletion: async (root, args, context) =>
      sprintController.deleteSprint(args, context),
    taskCreation: async (root, args, context) =>
      taskController.createTask(args, context),
    taskUpdate: async (root, args, context) =>
      taskController.updateTask(args, context),
    taskStatusUpdate: async (root, args, context) =>
      taskController.updateTaskStatus(args, context),
    taskSprintDeletion: async (root, args, context) =>
      taskController.removeTaskFromSprint(args, context),
    taskDeletion: async (root, args, context) =>
      taskController.deleteTask(args, context),
    tasksSprintAddition: async (root, args, context) =>
      taskController.addTasksToSprint(args, context),
    githubIssueCreation: async (root, args, context) =>
      repositoryController.createIssue(args, context),
    githubProjectCreation: async (root, args, context) =>
      repositoryController.createProjectFromRepo(args, context)
  }
};

module.exports = resolvers;
