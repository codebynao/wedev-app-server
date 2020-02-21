'use strict'

module.exports = function(mongoose, server) {


  // Connect to mongodb
  const mongoOptions = {
    auto_reconnect: true,
    keepAlive: 2000,
    connectTimeoutMS: 30000,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }

  mongoose.connect(process.env.MONGO_URI, mongoOptions)

  // If the connection throws an error
  mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err)
  })

  mongoose.connection.on('reconnected', function() {
    console.debug('MongoDB reconnected')
  })

  mongoose.connection.on('connected', function() {
    console.debug('MongoDB connected on %s', process.env.MONGO_URI)
  })

  // When the connection is disconnected, Log the error
  mongoose.connection.on('disconnected', function() {
    console.warn('MongoDB disconnected')
  })

  const cleanup = () => {
    mongoose.connection.close(() => {
      process.exit(0)
    })
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
}