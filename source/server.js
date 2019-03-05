import mongoose from 'mongoose';
import restify from 'restify';
import jwt from 'restify-jwt-community';
import validator from 'restify-joi-middleware';
import cookieParser from 'restify-cookies';
import dotenv from 'dotenv';
import { resolve } from 'path';

import {
  user,
  users
} from './routes';

import {
  userPATCHValidation,
  userPUTValidation,
  userPOSTValidation
} from './validation';

const ENV_PATH = resolve(__dirname, '../.env');
dotenv.config({
  allowEmptyValues: false,
  path: ENV_PATH,
});

const {
  name,
  version
} = require('../package.json');

const {
  MONGODB_PORT,
  MONGODB_HOST,
  MONGODB_NAME,
  JWT_SECRET,
} = process.env;

const PORT = process.env.PORT || 3055;

const jwtOptions = {
  secret: JWT_SECRET,
  getToken: req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    if (req.query && req.query.token) {
      return req.query.token;
    }
    if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
};

const server = restify.createServer({
  name,
  version,
});
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.gzipResponse());
server.use(cookieParser.parse);
server.use(validator());

server.pre((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.charSet('utf-8');
  return next();
});

server.use(jwt(jwtOptions).unless({
  method: 'OPTIONS'
}));

// Users list

/**
 * OPTIONS for users entitie
 */
server.opts('/', users.opt);

/**
 * GET list of users
 */
server.get('/', users.get);

/**
 * Create new user
 */
server.post({
    path: '/',
    validation: userPOSTValidation,
  },
  users.post,
);

// User

/**
 * Replace user by id
 * @type {String} id - user id
 */
server.put({
    path: '/:id',
    validation: userPUTValidation,
  },
  user.put,
);

/**
 * Edit user by id
 * @type {String} id - user id
 */
server.patch({
    path: '/:id',
    validation: userPATCHValidation,
  },
  user.patch,
);

/**
 * Get user by ID
 * @type {String} id - user id
 * @return {Object} - user
 */
server.get('/:id', user.get);

/**
 * Remove user by ID
 * @type {String} - user id
 */
server.del('/:id', user.del);

/**
 * OPTIONS for user entitie
 * @type {String} - user id
 */
server.opts('/:id', user.opt);

/**
 * Connect to mongo db and start listen for connection
 */
(async () => {
  mongoose.Promise = global.Promise;
  await mongoose.connect(
    `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  );
  server.listen(PORT);
})();
