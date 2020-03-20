'use strict';

const octonode = require('octonode');

class Github {
  constructor(accessToken) {
    this.accessToken = accessToken;

    this.github = octonode.client(accessToken);
  }

  createIssue(issue, repoFullName) {
    return new Promise(resolve => {
      const ghrepo = this.github.repo(repoFullName);
      ghrepo.issue(issue, (err, body) => {
        if (err) {
          console.error('Error Github createIssue', error);
        }
        resolve(body);
      });
    });
  }

  getReposList() {
    return new Promise(resolve => {
      this.github.me().repos((err, body) => {
        if (err) {
          console.error('Error Github getReposList', error);
        }
        resolve(body);
      });
    });
  }

  getUserInfo() {
    return new Promise(resolve => {
      this.github.me().info((err, body) => {
        if (err) {
          console.error('Error Github getUserInfo', error);
        }
        resolve(body);
      });
    });
  }

  getYamlConfigFile(repoFullName) {
    const ghrepo = this.github.repo(repoFullName);

    return new Promise(resolve => {
      ghrepo.contents('wedev.config.yml', (err, body) => {
        if (err) {
          console.error('Error Github getUserInfo', error);
        }
        resolve(body);
      });
    });
  }
}

module.exports = Github;
