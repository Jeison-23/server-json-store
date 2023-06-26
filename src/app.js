import './dataBase/connection.js';
import './utils/encrypt.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { user, userSave, userDelete } from './resolvers/userResolv.js';
import { role, roleSave, roleDelete } from './resolvers/roleResolv.js';
import { product, productSave, productDelete } from './resolvers/productResolv.js';
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

  #----role------#

  type Role {
    _id: String
    key: String
    rol: String
  }

  input roleInput {
    _id: String
    key: String
    rol: String
  }

  #----user------#

  type User {
    _id: String
    role: Role
    firstName: String
    lastName: String
    phone: String
    email: String
    password: String
  }

  input userInput {
    _id: String
    roleId: String
    firstName: String
    lastName: String
    phone: String
    email: String
    password: String
  }

  #----query-----#

  type Query {
    role: [Role]
    user: [User]
    category: [Category]
    product: [Product]
  }

  type Mutation {
    roleSave(input: roleInput): ID
    roleDelete(_id: String): Boolean
    userSave(input: userInput): ID
    userDelete(_id: String): Boolean
    categorySave(input: categoryInput): ID
    categoryDelete(_id: String): Boolean
    productSave(input: productInput): ID
    productDelete(ids: [String]!): Boolean
  }
`;

const resolvers = {
  Query: {
    role,
    user,
    category,
    product
  },
  Mutation: {
    roleSave,
    roleDelete,
    userSave,
    userDelete,
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