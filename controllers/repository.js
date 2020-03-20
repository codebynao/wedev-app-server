'use strict';
// Dependencies
const { AuthenticationError, ApolloError } = require('apollo-server-hapi');
const yaml = require('js-yaml');
const Joi = require('@hapi/joi');
// Lib
const Github = require('../lib/github');
const auth = require('../lib/auth');
// Models
const ProjectModel = require('../models/Project');
// Schemas
const { creationSchema, updateSchema } = require('./../schemas/project');

class Repository {
  /**
   * Create an issue in a repository
   * @param {Object} args - request payload
   * @param {Object} args.issue - issue to create
   * @param {String} args.projectId - project for which the issue is created
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - URL of the issue created
   */
  async createIssue(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (
        !context.user ||
        !auth.hasProjectPermission(context.user, args.projectId)
      ) {
        throw new AuthenticationError('Action non autorisée');
      }

      // If no Github access token, we can't get repos list
      if (!context.user.githubToken) {
        throw new ApolloError("Veuillez ajouter un token d'accès Github.", 500);
      }

      const project = await ProjectModel.findById(
        args.projectId,
        'repositories'
      );

      // Project doesn't have any repository linked to itself
      if (!project.repositories.length) {
        throw new ApolloError("Ce projet n'est pas lié à un dépôt github", 500);
      }

      const github = new Github(context.user.githubToken);
      const issue = await github.createIssue(
        args.issue,
        project.repositories[0].fullName
      );

      return issue.html_url;
    } catch (error) {
      console.error('Error createIssue', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Create a project from a repository
   * @param {Object} args - request payload
   * @param {Object} args.repoFullName - repository full name
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Project created
   */
  async createProjectFromRepo(args, context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // If no Github access token, we can't get repos list
      if (!context.user.githubToken) {
        throw new ApolloError("Veuillez ajouter un token d'accès Github.", 500);
      }

      // Get yaml config from repo
      const github = new Github(context.user.githubToken);
      const config = await github.getYamlConfigFile(args.repoFullName);

      // Config content is encoded in base64, let's decode it
      const buff = new Buffer(config.content, 'base64');
      const decodedYml = buff.toString('utf8');

      // Convert yaml to json object
      const jsonProject = yaml.safeLoad(decodedYml);

      // Add user id to project
      jsonProject.user = context.user._id.toString();

      // Check project arguments validity
      Joi.assert(jsonProject, creationSchema);

      // Return created project
      return await ProjectModel.create(jsonProject);
    } catch (error) {
      console.error('Error createProjectFromRepo', error);
      throw new Error(error.message || error);
    }
  }

  /**
   * Get Github repositories of a user
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Repositories found
   */
  async getReposList(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // If no Github access token, we can't get repos list
      if (!context.user.githubToken) {
        throw new ApolloError("Veuillez ajouter un token d'accès Github.", 500);
      }

      const github = new Github(context.user.githubToken);
      const repos = await github.getReposList();

      return repos.map(repo => {
        return {
          githubId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          owner: repo.owner.login,
          description: repo.description
        };
      });
    } catch (error) {
      console.error('Error getReposList', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Repository();
