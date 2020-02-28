'use strict';

require('dotenv').config();

// console.info(process.env);
const hapi = require('@hapi/hapi');
const mongoose = require('mongoose');

const { ApolloServer } = require('apollo-server-hapi');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = hapi.Server({
  port: process.env.PORT,
  host: process.env.HOST,
  routes: {
    cors: true
  }
});
const server = new ApolloServer({ typeDefs, resolvers });
const init = async () => {
  await server.applyMiddleware({
    app
  });

  require('./lib/dbConnection')(mongoose, app); // Init DB

  await server.installSubscriptionHandlers(app.listener);

  app.route([
    {
      method: 'GET',
      path: '/',
      handler: function(req, res) {
        return `<h1>Hello hapi</h1>`;
      }
    }
  ]);

  // Not working for now, let's see if we want to localize server errors in web app
  app.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response.data && response.data.errorLabel) {
      response.output.payload.errorLabel = response.data.errorLabel;
    }
    return h.continue;
  });

  await app.start();
  console.info(`Server running at ${app.info.uri}`);
};

init();
