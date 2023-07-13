import './dataBase/connection.js';
import './utils/encrypt.js';
import { ApolloServer } from "@apollo/server";
import { user, userSave, userDelete } from './resolvers/userResolv.js';
import { role, roleSave, roleDelete } from './resolvers/roleResolv.js';
import { product, productSave, productDelete } from './resolvers/productResolv.js';
import { category, categorySave, categoryDelete } from './resolvers/categoryResolv.js';
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs"
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs"
import { ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core'
import express from 'express'
import cors from 'cors';
import http from 'http';
import { expressMiddleware } from '@apollo/server/express4';

const typeDefs = `
  scalar Upload
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
    image: JSONObject
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
    image: JSONObject
    id: Int
    typeId: String
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
  Upload: GraphQLUpload,
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