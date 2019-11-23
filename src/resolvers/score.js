import { combineResolvers } from 'graphql-resolvers';
import uploadFile from '../utils/uploadFile'
import { EVENTS } from '../subscription';
import { isAdmin } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    scores: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            createdAt: {
              $lt: fromCursorHash(cursor),
            },
          }
        : {};
      const scores = await models.Score.find(
        cursorOptions,
        null,
        {
          sort: { createdAt: -1 },
          limit: limit + 1,
        },
      ).populate('victoryTeam').populate('looserTeam').exec();

      const hasNextPage = scores.length > limit;
      const edges = hasNextPage ? scores.slice(0, -1) : scores;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges[edges.length - 1] ?  toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ) : null,
        },
      };
    },
    score: async (parent, { id }, { models }) => {
      return await models.Score.findById(id).populate('victoryTeam').populate('looserTeam').exec();
    },
  },

  Mutation: {
    createScore: combineResolvers(
      // isAdmin,
      async (parent, { victoryPoint, looserPoint, victoryTeam, looserTeam }, { models }) => {

        let score = await models.Score.create({
          victoryPoint,
          looserPoint,
          victoryTeam,
          looserTeam
        })
        score = await score.populate('victoryTeam').populate('looserTeam').execPopulate()
      
        return score || null
      }
    ),

    deleteScore: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const score = await models.Score.findById(id);

        if (score) {
          await score.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },
};
