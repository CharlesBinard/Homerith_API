import { combineResolvers } from 'graphql-resolvers';
import uploadFile from '../utils/uploadFile'
import { isAdmin } from './authorization';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    teams: async (parent, { cursor, limit = 100 }, { models }) => {
      const cursorOptions = cursor
        ? {
            createdAt: {
              $lt: fromCursorHash(cursor),
            },
          }
        : {};
      const teams = await models.Team.find(
        cursorOptions,
        null,
        {
          sort: { createdAt: -1 },
          limit: limit + 1,
        },
      );

      const hasNextPage = teams.length > limit;
      const edges = hasNextPage ? teams.slice(0, -1) : teams;

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
    team: async (parent, { id }, { models }) => {
      return await models.Team.findById(id);
    },
  },

  Mutation: {
    createTeam: combineResolvers(
      // isAdmin,
      async (parent, { name, logo }, { models }) => {
        const uploadedFile = await uploadFile(logo,'logo');
        const team = await models.Team.create({
          name,
          logo: uploadedFile
        });

        return team || null
      }
    ),

    deleteTeam: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        const team = await models.Team.findById(id);

        if (team) {
          await team.remove();
          return true;
        } 
          return false;
        
      },
    ),
  },
};
