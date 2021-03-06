import {
  makeSchema,
  queryType,
  objectType,
  idArg,
  mutationType,
  inputObjectType,
  arg,
  nonNull,
} from 'nexus';
import path from 'path';

const Company = objectType({
  name: 'Company',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('symbol');
    t.nonNull.string('name');
    t.nonNull.string('description');
  }
});

const Query = queryType({
  definition(t) {
    t.field('company', {
      type: Company,
      // nullable: true
      args: {
        id: idArg(),
      },
      resolve: (_root, { id }, ctx) => {
        return ctx.prisma.company.findUnique({ where: { id: Number(id) } })
      },
    });

    t.nonNull.list.nonNull.field('companies', {
      type: Company,
      args: {},
      resolve: async (_root, args, ctx) => {
        return ctx.prisma.company.findMany()
      },
    });
  },
});


const CompanyCreateInput = inputObjectType({
  name: "CompanyCreateInput",
  definition(t) {
    t.nonNull.string("name")
    t.nonNull.string("symbol")
    t.nonNull.string("description")
  }
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field('createOneCompany', {
      type: Company,
      args: {
        data: arg({ type: nonNull(CompanyCreateInput) }),
      },
      resolve: async (_root, { data }, context) => {
        const company = await context.prisma.company.create({
          data
        })
        return company
      }
    })
  }
});

export const schema = makeSchema({
  types: { Query, Company, Mutation },
  outputs: {
    schema: path.join(process.cwd(), 'schema.graphql'),
    typegen: path.join(process.cwd(), 'nexus.ts')
  },
  typegenAutoConfig: {
    contextType: 'Context.Context',
    sources: [
      {
        source: '@prisma/client',
        alias: 'prisma',
      },
      {
        source: require.resolve('./context'),
        alias: 'Context',
      },
    ],
  }
});
