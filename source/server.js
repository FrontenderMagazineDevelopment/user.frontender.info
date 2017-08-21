import 'babel-polyfill';
import restify from 'restify';
import joi from 'joi';
import jwt from 'restify-jwt';
import cookieParser from 'restify-cookies';
import dotenv from 'dotenv';
import fs from 'fs';
import { resolve } from 'path';
import validator from 'restify-joi-middleware';
import Users from './Users';

let users;
const userValidation = {
  body: joi.object().keys({
    name: joi.string().required(),

    avatar: joi.string().uri(),
    twitter: joi.string(),
    blog: joi.string().uri(),
    email: joi.string().email(),
    trello: joi.string(),

    team: joi.boolean().default(false),
    core: joi.boolean().default(false),

    translator: joi.boolean().default(false),
    editor: joi.boolean().default(false),
    developer: joi.boolean().default(false),
    author: joi.boolean().default(false),

    salary: joi.number(),
  }).required(),
};

const ENV_PATH = resolve(__dirname, '../../.env');
const CONFIG_DIR = '../config/';
const CONFIG_PATH = resolve(__dirname, `${CONFIG_DIR}application.${(process.env.NODE_ENV || 'local')}.json`);

if (!fs.existsSync(ENV_PATH)) throw new Error('Envirnment files not found');
dotenv.config({ path: ENV_PATH });

if (!fs.existsSync(CONFIG_PATH)) throw new Error(`Config not found: ${CONFIG_PATH}`);
const config = require(CONFIG_PATH);
const { name, version } = require('../package.json');


const PORT = process.env.PORT || 3005;
const server = restify.createServer({ name, version });
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.gzipResponse());
server.use(cookieParser.parse);
server.use(validator());

server.pre((req, res, next) => {
  if (
    req.cookies === undefined ||
    req.cookies.token === undefined
  ) {
    res.redirect(302, config.authURL, next);
  }
  return next();
});

server.pre((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.charSet('utf-8');
  return next();
});

// Collection

server.get(
  '/',
  jwt({ secret: 'secret' }),
  async (req, res) => {
    try {
      const result = await users.getUsers();
      console.log(result);
      res.status(200);
      res.send(result).end();
    } catch (error) {
      res.status(500);
      res.send(error).end();
    }
  });

server.post({
  path: '/',
  validation: userValidation,
}, async (req, res) => {
  try {
    const result = await users.createUser(req.body);
    console.log(result);
    res.status(201);
    res.send(result).end();
  } catch (error) {
    res.status(500);
    res.send(error).end();
  }
});

// User

server.put('/:id', (req, res, next) => {
  res.status(200);
  res.send('user replaced or created').end();
});

server.patch('/:id', (req, res, next) => {
  res.status(200);
  res.send('user updated').end();
});

server.get('/:id', (req, res, next) => {
  console.log(req.params.id);
  res.status(200);
  res.send('user').end();
});

server.del('/:id', (req, res, next) => {
  res.status(200);
  res.send('user deleted').end();
});

(async () => {
  users = new Users(`mongodb://${config.mongoDBHost}:${config.mongoDBPort}/${config.mongoDBName}`);
  await users.connect();
  server.listen(PORT);
})();
