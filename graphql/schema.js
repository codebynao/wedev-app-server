const { gql } = require('apollo-server-hapi')
const typeDefs = gql`
  type Mock {
    id: String
    name: String
    artist: String
  }
  type Query {
    mock(id: ID!): Mock
  }
`;

module.exports = typeDefs
