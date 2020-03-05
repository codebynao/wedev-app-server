const { gql } = require('apollo-server-hapi');

const typeDefs = gql`
  type AuthUser {
    _id: ID
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
  type User {
    _id: ID
    lastName: String
    firstName: String
    company: String
    siret: String
    email: String
    phone: String
    companyStatus: String
    professionalStatus: String
    isDeactivated: Boolean
  }
  type Query {
    user(_id: ID!): User
  }
  type Mutation {
    userDeactivation(_id: ID!): Boolean
    userLogin(email: String!, password: String!): AuthUser
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
    ): AuthUser
    userUpdate(
      _id: ID!
      lastName: String!
      firstName: String!
      company: String
      siret: String
      email: String!
      phone: String
      companyStatus: String
      professionalStatus: String
    ): User
  }
`;

module.exports = typeDefs;
