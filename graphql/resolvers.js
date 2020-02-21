const resolvers = {
  Query: {
    mock: async (root, args) => args
  }
};

module.exports = resolvers;
