'use strict';

const { AuthenticationError } = require('apollo-server-hapi');
const Github = require('../lib/github');

class Repository {
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
