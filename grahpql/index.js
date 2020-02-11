const graphQL = require('graphql');
const graphQLBookshelf = require('graphql-bookshelfjs');

module.exports = function schema(models) {
    const UserQuery = new graphQL.GraphQLObjectType({
        name: 'users',
        fields: {
            id: {
                type: graphQL.GraphQLInt,
            },
            username: {
                type: graphQL.GraphQLString,
            },
            password: {
                type: graphQL.GraphQLString,
            },
            avatar: {
                type: graphQL.GraphQLString,
            }
        },
    });

    const RootQuery = new graphQL.GraphQLObjectType({
        name: 'RootQuery',
        fields: {
            user: {
                type: UserQuery,
                args: {
                    password: {
                        type: graphQL.GraphQLString,
                    },
                    username: {
                        type: graphQL.GraphQLString,
                    }
                },
                resolve: graphQLBookshelf.resolverFactory(models.User)
            },
        },
    });

    return new graphQL.GraphQLSchema({ query: RootQuery });
}