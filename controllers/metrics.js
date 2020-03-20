'use strict';

const ProjectModel = require('./../models/Project');
const config = require('./../config/default');

class Metrics {
  /**
   * Get total number of projects with a specific status
   * @param {Array} projects
   * @param {String} status
   * @returns {Number}
   */
  getTotalProjectsWithStatus(projects, status) {
    return projects.filter(project => project.status === status).length;
  }

  /**
   * Get total revenues
   * @param {Array} projects
   * @returns {Number}
   */
  getTotalRevenues(projects) {
    const finishedProjects = projects.filter(
      project => project.status === config.PROGRESS_STATUS.DONE
    );

    return finishedProjects.reduce((previousValue, currentValue) => {
      const float = currentValue.quote || 0;
      return previousValue + parseFloat(float);
    }, 0);
  }

  /**
   * Get average hourly rate
   * @param {Array} projects
   * @returns {Number}
   */
  getAverageHourlyRate(projects) {
    return projects.reduce((previousValue, currentValue) => {
      const float = currentValue.hourlyRate || 0;
      return previousValue + parseFloat(float);
    }, 0);
  }

  /**
   * Get metrics of projects
   * @param {Object} context - request context
   * @param {Object} context.user - logged in user info
   * @returns {Object} - Metrics
   */
  async getMetrics(context) {
    try {
      // Check if logged in user is authorized to perform this action
      if (!context.user) {
        throw new AuthenticationError('Action non autorisée');
      }

      // Get list of projects of this user
      const projects = await ProjectModel.find(
        { user: context.user._id },
        'hourlyRate quote status'
      ).lean();

      // Get total number of finished projects
      const totalFinishedProjects = this.getTotalProjectsWithStatus(
        projects,
        config.PROGRESS_STATUS.DONE
      );

      // Get total number of projects in progress
      const totalWIPProjects = this.getTotalProjectsWithStatus(
        projects,
        config.PROGRESS_STATUS.WIP
      );

      // Get total revenues
      const totalRevenues = this.getTotalRevenues(projects);

      // Get average hourly rate
      const averageHourlyRate = this.getAverageHourlyRate(projects);
      return {
        totalFinishedProjects,
        totalWIPProjects,
        totalRevenues,
        averageHourlyRate
      };
    } catch (error) {
      console.error('Error getMetrics', error);
      throw new Error(error.message || error);
    }
  }
}

module.exports = new Metrics();
