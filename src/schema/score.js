import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    scores(cursor: String, limit: Int): ScoreConnection!
    score(id: ID!): Score!
  }

  extend type Mutation {
    createScore(victoryPoint: Int!,looserPoint: Int!,victoryTeam: ID!,looserTeam: ID!): Score!
    deleteScore(id: ID!): Boolean!
  }

  type ScoreConnection {
    edges: [Score!]
    pageInfo: PageInfo!
  }

  type Score {
    id: ID!
    victoryPoint: Int!
    looserPoint: Int!
    victoryTeam: Team!
    looserTeam: Team!
  }
`;


