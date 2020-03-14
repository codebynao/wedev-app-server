const { gql } = require('apollo-server-hapi');

const typeDefs = gql`
  # User
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
    isDeactivated: Boolean
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
    isDeactivated: Boolean
  }

  # Client
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
    isDeleted: Boolean
  }
  input ClientInput {
    _id: ID
    corporateName: String!
    contact: ContactInput!
    address: AddressInput
    projects: [String]
    isDeleted: Boolean
  }

  # Project
  type Stack {
    category: String
    name: String
    description: String
  }
  input StackInput {
    category: String!
    name: String!
    description: String
  }

  type Repository {
    url: String
    name: String
    token: String
  }
  input RepositoryInput {
    url: String!
    name: String!
    token: String!
  }

  type ProjectClient {
    _id: ID
    corporateName: String
    contact: Contact
    address: Address
  }

  type Project {
    _id: ID
    title: String
    quote: String
    implementationDeadline: String
    startDate: String
    endDate: String
    status: String
    stacks: [Stack]
    dailyRate: String
    client: ProjectClient
    user: String
    delay: String
    repositories: [Repository]
    tasks: [Task]
    sprints: [String]
    isDeleted: Boolean
  }
  input ProjectInput {
    _id: ID
    title: String!
    quote: String
    implementationDeadline: String
    startDate: String!
    endDate: String
    status: String!
    stacks: [StackInput]
    dailyRate: String
    client: String
    user: String!
    delay: String
    repositories: [RepositoryInput]
    tasks: [String]
    sprints: [String]
    isDeleted: Boolean
  }

  # Task
  type Task {
    _id: ID
    title: String
    description: String
    status: String
    startDate: String
    endDate: String
    completionTime: String
    project: String
    sprint: String
  }
  input TaskInput {
    _id: ID
    title: String!
    description: String
    status: String!
    startDate: String
    endDate: String
    completionTime: String
    project: String!
    sprint: String
  }

  # Sprint
  type Sprint {
    _id: ID
    title: String
    status: String
    startDate: String
    endDate: String
    project: String
    tasks: [Task]
  }
  input SprintInput {
    _id: ID
    title: String!
    status: String!
    startDate: String
    endDate: String
    project: String!
    tasks: [String]
  }

  # Query
  type Query {
    client(_id: ID!): Client
    clients: [Client]
    project(_id: ID!): Project
    projects: [Project]
    sprint(_id: ID!): Sprint
    sprints: [Sprint]
    task(_id: ID!): Task
    tasks: [Task]
    user(_id: ID!): User
  }

  # Mutation
  type Mutation {
    userDeactivation(_id: ID!): Boolean
    userLogin(email: String!, password: String!): AuthUser
    userRegister(user: AuthUserInput!): AuthUser
    userUpdate(user: UserInput!): User
    clientDeletion(_id: ID!): Boolean
    clientCreation(client: ClientInput!): Client
    clientUpdate(client: ClientInput!): Client
    projectDeletion(_id: ID!): Boolean
    projectCreation(project: ProjectInput!): Project
    projectUpdate(project: ProjectInput!): Project
    sprintCreation(sprint: SprintInput!): Sprint
    sprintUpdate(sprint: SprintInput!): Sprint
    sprintDeletion(_id: ID!): Boolean
    taskCreation(task: TaskInput!): Task
    taskUpdate(task: TaskInput!): Task
    taskDeletion(_id: ID!): Boolean
  }
`;

module.exports = typeDefs;
