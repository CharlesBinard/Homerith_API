import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    scores(cursor: String, limit: Int): ScoreConnection!
    score(id: ID!): Score!
  }

  extend type Mutation {
    createScore(vicotoryPoint: Int!,looserPoint: Int!,victoryTeam: Int!,looserTeam: Int!): Score!
    deleteScore(id: ID!): Boolean!
  }

  type ScoreConnection {
    edges: [Score!]
    pageInfo: PageInfo!
  }

  type Score {
    id: ID!
    vicotoryPoint: Int!
    looserPoint: Int!
    victoryTeam: Team!
    looseTeam: Team!
  }

  extend type Subscription {
    scoreCreated: ScoreCreated!
  }

  type ScoreCreated {
    score: Score!
  }
`;


