const express = require('express');
const graphqlHTTP = require('express-graphql');

const app = express();

import MyGraphQLSchema from './database';

app.use('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}));

app.listen(4000);