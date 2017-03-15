/* eslint-disable no-unused-vars, no-use-before-define */
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  cursorForObjectInConnection,
} from 'graphql-relay';

import {
  getAdmin,

  getUsers,
  getUser,
  getOrders,
  getOrder,
  getNodes,
  createUser,
  getNode,
} from './database';


/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    // console.log('this is in nodeDefinition. -globalid', globalId);
    const { type, id } = fromGlobalId(globalId);
    if (type === 'Admin') {
      return getAdmin();
    } else if (type === 'User') {
      return getUser(id);
    } else if (type === 'Node') {
      return getNode(id);
    } else if (type === 'Order') {
      return getOrder(id);
    }
    return null;
  },
  obj =>
    // console.log('this is in nodeDefinition.', obj);
    // if(obj.hasOwnProperty(''))
     null
);

/**
 * Define your own types here
 */

const adminType = new GraphQLObjectType({
  name: 'Admin',
  description: 'Admin of yetta.',
  fields: () => ({
    id: globalIdField('Admin'),
    email: {
      type: GraphQLString,
      description: 'Admin\'s email'
    },
    name: {
      type: GraphQLString,
      description: 'Admin\'s name'
    },
    users: {
      type: userConnection,
      description: 'user list',
      args: connectionArgs,
      resolve: (_, args) => getUsers().then(list => connectionFromArray(list, args))
    },
    user: {
      type: userType,
      description: 'user by id',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (_, { id }) => getUser(fromGlobalId(id).id)
    },
    // runners: {
    //
    // },
    // runner: {
    //
    // },
    // nodes: {
    //
    // },
    // node: {
    //
    // },
    // orders: {
    //
    // },
    // order: {
    //
    // }


  }),
  interfaces: [nodeInterface]
});

const userType = new GraphQLObjectType({
  name: 'User',

  description: 'A user of Yetta.',
  fields: () => ({
    id: globalIdField('User'),
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    createdAt: { type: GraphQLFloat },
    phoneNumber: { type: GraphQLString },
    isPhoneValid: { type: GraphQLBoolean },
    rating: { type: GraphQLInt },
    profileImageUrl: { type: GraphQLString },
    identificationImageUrl: { type: GraphQLString },
  }),
  interfaces: [nodeInterface]
});

const featureType = new GraphQLObjectType({
  name: 'Feature',
  description: 'Dashboard integrated in our starter kit',
  fields: () => ({
    id: globalIdField('Feature'),
    name: {
      type: GraphQLString,
      description: 'Name of the feature'
    },
    description: {
      type: GraphQLString,
      description: 'Description of the feature'
    },
    url: {
      type: GraphQLString,
      description: 'Url of the feature'
    }
  }),
  interfaces: [nodeInterface]
});

/**
 * Define your own connection types here
 */
const { connectionType: featureConnection, edgeType: featureEdge } = connectionDefinitions({ name: 'Feature', nodeType: featureType });
const { connectionType: userConnection, edgeType: userEdge } = connectionDefinitions({ name: 'User', nodeType: userType });
/**
 * Create feature example
 */

const createUserMutation = mutationWithClientMutationId({
  name: 'CreateUser',
  inputFields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    userEdge: {
      type: userEdge,
      resolve: obj =>
        // TODO: What is cursorForObjectInConnection?
         getUsers().then((list) => {
           const cursorId = cursorForObjectInConnection(list, obj);
           return { node: obj, cursor: cursorId };
         })
    }
  },
  mutateAndGetPayload: ({ name, email, password }) => createUser(name, email, password)
});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: adminType,
      resolve: () => getAdmin()
    }
  })
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser: createUserMutation
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export default new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
