const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const jwt = require('jsonwebtoken');

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    fields: {
        token: {type : GraphQLString}
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        login: {
            type: AuthType,
            args: {
                username: { type: GraphQLString},
                password: { type: GraphQLString},
            },
            resolve(parent, args) {
                // Perform login authentication here
                // Verify credentials, generate token
                return { token: jwt.sign({ username: args.username }, process.env.JWT_SECRET) };    
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        login: {
            type: AuthType,
            args: {
                username: { type: GraphQLString},
                password: { type: GraphQLString},
            },
            resolve(parent, args) {
                // Register new user here
                // Store user in DB and return JWT token
                return { token: jwt.sign({ username: args.username }, process.env.JWT_SECRET) };    
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

