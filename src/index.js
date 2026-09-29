import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { expressMiddleware } from '@as-integrations/express5';
import { resolvers, typeDefs } from './graphql/schema.js';

const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('Falta la variable de entorno MONGODB_URI.');
}

const app = express();
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault()],
});

app.get('/health', (_request, response) => {
  response.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? 'ok' : 'connecting',
  });
});

await mongoose.connect(mongoUri);
await apollo.start();

app.use(
  '/graphql',
  cors(),
  express.json(),
  expressMiddleware(apollo),
);

app.listen(port, '0.0.0.0', () => {
  console.log(`GraphQL API lista en el puerto ${port}`);
});