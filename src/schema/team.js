import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    teams(cursor: String, limit: Int): TeamConnection!
    team(id: ID!): Team!
  }

  extend type Mutation {
    createTeam(name: String!, logo: Upload): Team!
    deleteTeam(id: ID!): Boolean!
  }

  type TeamConnection {
    edges: [Team!]
    pageInfo: PageInfo!
  }

  type Team {
    id: ID!
    name: String!
    logo: String
    createdAt: Date!
  }

`;
