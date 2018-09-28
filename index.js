const {
  ApolloServer,
  gql
} = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require('./models')
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./services/auth');
const MongoStore = require('connect-mongo')(session);
const schema = require('./schema/schema')
const app = express();

const MONGO_URI = 'mongodb://localhost:27017/test-gql';

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URI)
mongoose.connection.once('open', () => console.log('Connected to mongodb')).on('error', error => console.log('Error Connecting to mongodb'))



app.use(bodyParser.json())

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'aaabbbccc',
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  schema,
  context:({req})=>({
    req
  })
});

server.applyMiddleware({
  app
})



app.listen(4000, () => {
  console.log(`Server is up on localhost://4000${server.graphqlPath}`)
})