import { existsSync } from 'fs';
import mongoose from 'mongoose';
import restify from 'restify';
import errors from 'restify-errors';
import jwt from 'restify-jwt-community';
import validator from 'restify-joi-middleware';
import cookieParser from 'restify-cookies';
import dotenv from 'dotenv-safe';
import { resolve } from 'path';

import Users from './models/Users';
import {
  userPATCHValidation,
  userPUTValidation,
  userPOSTValidation
} from './validation';

const ENV_PATH = resolve(__dirname, '../.env');
dotenv.config({allowEmptyValues: false, path: ENV_PATH});
const CONFIG_DIR = '../config/';
const CONFIG_PATH = resolve(
  __dirname,
  `${CONFIG_DIR}application.${process.env.NODE_ENV || 'local'}.json`,
);

if (!existsSync(CONFIG_PATH)) throw new Error(`Config not found: ${CONFIG_PATH}`);
const config = require(CONFIG_PATH); // eslint-disable-line
const { name, version } = require('../package.json');

const jwtOptions = {
  secret: process.env.JWT_SECRET,
  getToken: req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (req.cookies && req.cookies.token) {
      return req.cookies.token;
    }
    return null;
  },
};

const PORT = process.env.PORT || 3055;
const server = restify.createServer({ name, version });
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

server.get('/', jwt(jwtOptions), async (req, res, next) => {
  if (req.user.scope.isOwner === false) {
    res.status(401);
    res.end();
    return next();
  }
  if (req.url === '/favicon.ico') {
    res.state(204);
    res.end();
    return next();
  }
  const result = await Users.find();
  res.status(200);
  res.send(result);
  res.end();
  return true;
});

server.post(
  {
    path: '/',
    validation: userPOSTValidation,
  },
  jwt(jwtOptions),
  async (req, res, next) => {
    if (req.user.scope.isOwner === false) {
      res.status(401);
      res.end();
      return next();
    }

    const user = new Users(req.params);
    let result;
    try {
      result = await user.save();
    } catch (error) {
      res.status(400);
      res.send(error.message);
      res.end();
      return next();
    }

    res.link('Location', `${config}${result._id}`);
    res.header('content-type', 'json');
    res.status(201);
    res.send(result);
    res.end();
    return next();
  },
);

// User

/**
 * Replace user by id
 * @type {String} id - user id
 */
server.put(
  {
    path: '/:id',
    validation: userPUTValidation,
  },
  jwt(jwtOptions),
  async (req, res, next) => {

    if (req.user.scope.isOwner === false) {
      res.status(401);
      res.end();
      return next();
    }

    const result = await Users.replaceOne({ _id: req.params.id }, req.params);

    if (!result.ok) {
      res.status(500);
      res.end();
      return next();
    }

    if (!result.n) {
      res.status(404);
      res.end();
      return next();
    }

    let user;
    try {
      user = await Users.findById(req.params.id);
    } catch (error) {
      res.status(404);
      res.end();
      return next();
    }

    res.status(200);
    res.send(user);
    res.end();
    return next();
  },
);

/**
 * Edit user by id
 * @type {String} id - user id
 */
server.patch(
  {
    path: '/:id',
    validation: userPATCHValidation,
  },
  jwt(jwtOptions),
  async (req, res, next) => {
    if (req.user.scope.isTeam === false) {
      res.status(401);
      res.end();
      return next();
    }

    if (
      (req.user.scope.isOwner === false)
      && (req.user.scope.login.toLowerCase() !== req.params.github.toLowerCase())
    ) {
      res.status(401);
      res.end();
      return next();
    }

    const result = await Users.updateOne({ _id: req.params.id }, req.params);

    if (!result.ok) {
      res.status(500);
      res.end();
      return next();
    }

    if (!result.n) {
      res.status(404);
      res.end();
      return next();
    }

    let user;
    try {
      user = await Users.findById(req.params.id);
    } catch (error) {
      res.status(404);
      res.end();
      return next();
    }

    res.status(200);
    res.send(user);
    res.end();
    return next();
  },
);

/**
 * Get user by ID
 * @type {String} id - user id
 * @return {Object} - user
 */
server.get('/:id', jwt(jwtOptions), async (req, res, next) => {
  if (req.params.id === 'favicon.ico') {
    res.status(204);
    res.end();
    return next();
  }

  if (req.user.scope.isTeam === false) {
    res.status(401);
    res.end();
    return next();
  }

  let result;
  try {
    result = await Users.findById(req.params.id);
  } catch (error) {
    res.status(404);
    res.end();
    return next();
  }

  res.status(200);
  res.send(result);
  res.end();
  return next();
});

/**
 * Remove user by ID
 * @type {String} - user id
 */
server.del('/:id', jwt(jwtOptions), async (req, res, next) => {
  if (req.user.scope.isOwner === false) {
    res.status(401);
    res.end();
    return next();
  }

  const result = await Users.remove({ _id: req.params.id });

  if (!result.result.ok) {
    res.status(500);
    res.end();
    return next();
  }

  if (!result.result.n) {
    res.status(404);
    res.end();
    return next();
  }

  res.status(204);
  res.end();
  return next();
});

server.opts('/:id', jwt(jwtOptions), async (req, res) => {
  res.status(200);
  res.end();
});

server.opts('/', jwt(jwtOptions), async (req, res) => {
  res.status(200);
  res.end();
});

(async () => {
  mongoose.Promise = global.Promise;
  await mongoose.connect(
    `mongodb://${config.mongoDBHost}:${config.mongoDBPort}/${config.mongoDBName}`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  );
  server.listen(PORT);
})();
