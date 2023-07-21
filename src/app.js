import cors from 'cors'
import http from 'http'
import './utils/encrypt.js'
import express from 'express'
import './dataBase/connection.js'
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4'
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs"
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs"
import { user, userSave, userDelete } from './resolvers/userResolv.js'
import { role, roleSave, roleDelete } from './resolvers/roleResolv.js'
import { product, productSave, productDelete } from './resolvers/productResolv.js'
import { category, categorySave, categoryDelete } from './resolvers/categoryResolv.js'
import { post, postSave } from './resolvers/postResolv.js'
import { ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core'

const typeDefs = `
  scalar Upload
  scalar DateTime
  scalar JSONObject
  
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

  #----post------#

  input postInput {
    _id: String
    title: String
    type: String
    images: [Upload]
    description: String
    link: String
  }

  type Post {
    _id: String
    title: String
    type: String
    images: [String]
    createAt: DateTime
    description: String
    link: String
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
    image: String
    firstName: String
    lastName: String
    id: Int
    typeId: String
    phone: String
    email: String
    password: String
  }

  input userFilter {
    _id: String
    id: Int
    typeId: String
    roleId: String
    firstName: String
    lastName: String
    phone: String
    email: String
  }

  input userInput {
    _id: String
    roleId: String
    firstName: String
    lastName: String
    image: [Upload]
    id: Int
    typeId: String
    phone: String
    email: String
    password: String
  }

  #----query-----#

  type Query {
    role: [Role]
    user(filter: userFilter): [User]
    post: [Post]
    category: [Category]
    product: [Product]
  }

  type Mutation {
    roleSave(input: roleInput): ID
    roleDelete(_id: String): Boolean
    userSave(input: userInput): ID
    postSave(input: postInput): ID
    userDelete(_id: String): Boolean
    categorySave(input: categoryInput): ID
    categoryDelete(_id: String): Boolean
    productSave(input: productInput): ID
    productDelete(ids: [String]!): Boolean
  }
`;

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    role,
    user,
    post,
    category,
    product
  },
  Mutation: {
    roleSave,
    roleDelete,
    userSave,
    userDelete,
    postSave,
    categorySave,
    categoryDelete,
    productSave,
    productDelete
  }
}

const PORT = 4040;

export async function startApolloServer() {

  const app = express();

  app.use(
    graphqlUploadExpress(),
    express.static("public")
  )

  const httpServer = http.createServer(app);  

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    introspection: true,
    plugins: [
      // Install a landing page plugin based on NODE_ENV
      ApolloServerPluginLandingPageProductionDefault({
        embed: true
      })
     ],
  });

  await server.start();

  //Middlewares
  app.use(
    "/gql",
    cors(),
    express.json(),
    expressMiddleware(server)
  );

  app.get('/', (req, res) => {
    res.send('Bienvenido a mi GraphQl API');
  });

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  
  console.log(`http://localhost:${PORT}/gql`);
}

startApolloServer(); 

// const { url } = await startStandaloneServer(server, {
//   listen: { port: 4040 },
// })

// console.log(`🚀  Server ready at: ${url}`)