const { gql } = require('apollo-server-hapi');
const typeDefs = gql`
  type User {
    _id: String
    lastName: String
    firstName: String
    company: String
    siret: String
    email: String
    phone: String
    companyStatus: String
    professionalStatus: String
    token: String
  }
  type Query {
    getUser(_id: ID!): User
  }
  type Mutation {
    userLogin(email: String!, password: String!): User
    userRegister(
      lastName: String!
      firstName: String!
      company: String
      siret: String
      email: String!
      password: String!
      phone: String
      companyStatus: String
      professionalStatus: String
    ): User
  }
`;

module.exports = typeDefs;
