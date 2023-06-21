import './dataBase/connection.js';
import './utils/encrypt.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { product, productSave, productDelete } from './resolvers/productResolv.js';
import { user, userSave } from './resolvers/userResolv.js';
import { category, categorySave, categoryDelete } from './resolvers/categoryResolv.js';

const typeDefs = `
  type Category {
    _id: String
    key: String
    name: String
  }

  input categoryInput {
    _id: String
    key: String
    name: String
  }

  #----product---#

  type Product {
    _id: String
    name: String
    description: String
    category: Category
    price: Int
    stock: Int
  }

  input productInput {
    _id: String
    name: String
    description: String
    categoryId: String
    price: Int
    stock: Int
  }

  #----user------#

  type User {
    _id: String
    firstName: String
    lastName: String
    phone: Int
    email: String
    password: String
  }

  input userInput {
    _id: String
    firstName: String
    lastName: String
    phone: Int
    email: String
    password: String
  }

  #----query-----#

  type Query {
    user: [User]
    category: [Category]
    product: [Product]
  }

  type Mutation {
    userSave(input: userInput): ID
    categorySave(input: categoryInput): ID
    categoryDelete(_id: String): Boolean
    productSave(input: productInput): ID
    productDelete(ids: [String]!): Boolean
  }
`;

const resolvers = {
  Query: {
    user,
    category,
    product
  },
  Mutation: {
    userSave,
    categorySave,
    categoryDelete,
    productSave,
    productDelete
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4040 },
})

console.log(`🚀  Server ready at: ${url}`)