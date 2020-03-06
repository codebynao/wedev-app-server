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
    projects: [String]
    clients: [String]
  }
  input AuthUserInput {
    lastName: String!
    firstName: String!
    company: String
    siret: String
    email: String!
    password: String!
    phone: String
    companyStatus: String
    professionalStatus: String
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
    projects: [String]
    clients: [String]
  }
  input UserInput {
    _id: ID!
    lastName: String!
    firstName: String!
    company: String
    siret: String
    email: String!
    phone: String
    companyStatus: String
    professionalStatus: String
    projects: [String]
    clients: [String]
  }
  type Contact {
    lastName: String
    firstName: String
    phone: String
    email: String
  }
  input ContactInput {
    lastName: String!
    firstName: String!
    phone: String
    email: String
  }
  type Address {
    street: String
    zipcode: String
    city: String
    country: String
    additionalInformation: String
  }
  input AddressInput {
    street: String
    zipcode: String!
    city: String!
    country: String!
    additionalInformation: String
  }
  type Client {
    _id: ID
    corporateName: String
    contact: Contact
    address: Address
    projects: [String]
  }
  input ClientInput {
    _id: ID
    corporateName: String!
    contact: ContactInput!
    address: AddressInput
    projects: [String]
  }
  type Query {
    client(_id: ID!): Client
    clients: Client
    user(_id: ID!): User
  }
  type Mutation {
    userDeactivation(_id: ID!): Boolean
    userLogin(email: String!, password: String!): AuthUser
    userRegister(user: AuthUserInput!): AuthUser
    userUpdate(user: UserInput): User
    clientDeactivation(_id: ID!): Boolean
    clientCreation(client: ClientInput!): Client
    clientUpdate(client: ClientInput!): Client
  }
`;

module.exports = typeDefs;
