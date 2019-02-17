# user.frontender.info

Service to control users

## Installation

### Environment variables

Copy `./.env.sample` to `./.env` end make sure all variables are set.
You may enter any JWT_SECRET value, but make sure to be consistent in all projects with jwt authorization.

```bash
cp ./.env.sample ./.env
vi ./.env
```

### MongoDB

Download and run [MongoDB Server](https://www.mongodb.com/download-center/community). You should also set configuration for different environments in the `./config/application.YOUR_ENVIRONMENT.json`. Don't forget to create database. In MongoDB console run `use fm`;

### Build

Install dependencies and build project.

```bash
npm i
npm run build
npm start
```

Then you may access service on [http://localhost:3055/](http://localhost:3055/).

