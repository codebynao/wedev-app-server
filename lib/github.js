'use strict';

const octonode = require('octonode');

class Github {
  constructor(accessToken) {
    this.accessToken = accessToken;

    this.github = octonode.client(accessToken);
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
}

module.exports = Github;
