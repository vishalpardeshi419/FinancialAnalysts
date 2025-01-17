const { GraphQLObjectType, GraphQLSchema, GraphQLString } = require('graphql');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import your User model
const bcrypt = require('bcryptjs'); // For hashing passwords (if needed)

const AuthType = new GraphQLObjectType({
  name: 'Auth',
  fields: {
    token: { type: GraphQLString }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    login: {
      type: AuthType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        // Find user by username
        return User.findOne({ where: { username: args.username } })
          .then(user => {
            if (!user) {
              throw new Error('User not found');
            }

            // Verify password (if password is used for login)
            const isMatch = bcrypt.compareSync(args.password, user.password);
            if (!isMatch) {
              throw new Error('Invalid credentials');
            }
            const payload = { username: args.username };
            // Generate and return JWT token
            return { token: jwt.sign(payload , process.env.JWT_SECRET) };
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'mutation',
  fields: {
    register: {
      type: AuthType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(parent, args) {
        // Check if the user already exists
        return User.findOne({ where: { email: args.email } })
          .then(existingUser => {
            if (existingUser) {
              throw new Error('User already exists');
            }

            // Hash password before saving
            const hashedPassword = bcrypt.hashSync(args.password, 10);

            // Create new user in the database
            return User.create({
              username: args.username,
              email: args.email,
              password: hashedPassword,
              role: 'User', // Assign default role if needed
              createdAt: new Date(),
              updatedAt: new Date()
            }).then(user => {
              // Generate JWT token
              const payload = { username: args.username };
              return { token: jwt.sign(payload, process.env.JWT_SECRET) };
            });
          })
          .catch(err => {
            throw new Error(err.message);
          });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});


