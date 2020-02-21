'use strict'

require('dotenv').config()

const hapi = require('@hapi/hapi')
const mongoose = require('mongoose')

const { ApolloServer } = require('apollo-server-hapi')
const typeDefs = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const app = hapi.Server({
	port: process.env.PORT,
	host: process.env.HOST
})
const server = new ApolloServer({ typeDefs, resolvers });
const init = async () => {
	await server.applyMiddleware({
    app,
  });
  
  await app.register([
    require('@hapi/inert'), // Hapi module for static files
  ])
	
  require('./lib/dbConnection')(mongoose, app) // Init DB

	await server.installSubscriptionHandlers(app.listener);
  

	app.route([
		{
		method: 'GET',
		path: '/',
		handler: function(req, res) {
			return `<h1>Hello hapi</h1>`
		}
		}
	])

	await app.start()
	console.info(`Server running at ${app.info.uri}`)
}

init()