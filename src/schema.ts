import { makeSchema, queryType } from 'nexus';

const Query = queryType({
  definition(t) {
    t.string('name', { resolve: () => 'Tony Kharioki' });
  },
});
export const schema = makeSchema({
    types: { Query }
});